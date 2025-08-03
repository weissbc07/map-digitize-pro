import { useState, useCallback, useRef } from 'react';
import type { VectorFeature, ZoningType, EditingMode } from '@/components/zoning/zoning-types';

interface HistoryState {
  features: VectorFeature[];
  timestamp: number;
}

interface UseVectorFeaturesReturn {
  features: VectorFeature[];
  selectedFeatures: VectorFeature[];
  editingMode: EditingMode;
  historyPosition: number;
  canUndo: boolean;
  canRedo: boolean;
  snapEnabled: boolean;
  snapTolerance: number;
  
  // Feature management
  addFeature: (feature: Omit<VectorFeature, 'id' | 'properties'>, zoneType: ZoningType) => void;
  updateFeature: (id: string, updates: Partial<VectorFeature>) => void;
  removeFeature: (id: string) => void;
  removeFeatures: (ids: string[]) => void;
  clearAllFeatures: () => void;
  
  // Selection management
  selectFeature: (id: string) => void;
  selectFeatures: (ids: string[]) => void;
  selectAllFeatures: () => void;
  clearSelection: () => void;
  toggleFeatureSelection: (id: string) => void;
  
  // Editing mode
  setEditingMode: (mode: EditingMode) => void;
  
  // History management
  undo: () => void;
  redo: () => void;
  pushToHistory: () => void;
  
  // Spatial operations
  mergeSelectedFeatures: (zoneType: ZoningType) => void;
  splitFeature: (id: string, splitLine: number[][]) => void;
  bufferFeatures: (ids: string[], distance: number) => void;
  
  // Measurements
  calculateFeatureArea: (id: string) => number;
  calculateFeaturePerimeter: (id: string) => number;
  getTotalArea: () => number;
  
  // Snapping
  setSnapEnabled: (enabled: boolean) => void;
  setSnapTolerance: (tolerance: number) => void;
  
  // Batch operations
  updateSelectedFeatures: (updates: Partial<VectorFeature>) => void;
  setZoneTypeForSelected: (zoneType: ZoningType) => void;
}

const MAX_HISTORY_SIZE = 50;

export const useVectorFeatures = (): UseVectorFeaturesReturn => {
  const [features, setFeatures] = useState<VectorFeature[]>([]);
  const [selectedFeatureIds, setSelectedFeatureIds] = useState<string[]>([]);
  const [editingMode, setEditingMode] = useState<EditingMode>({ type: 'select', active: false });
  const [snapEnabled, setSnapEnabled] = useState(true);
  const [snapTolerance, setSnapTolerance] = useState(15);
  
  // History management
  const [history, setHistory] = useState<HistoryState[]>([{ features: [], timestamp: Date.now() }]);
  const [historyPosition, setHistoryPosition] = useState(0);
  const lastSaveTime = useRef(Date.now());

  const selectedFeatures = features.filter(f => selectedFeatureIds.includes(f.id));
  const canUndo = historyPosition > 0;
  const canRedo = historyPosition < history.length - 1;

  // Generate unique ID for new features
  const generateId = useCallback(() => {
    return `feature-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }, []);

  // Calculate area using shoelace formula
  const calculateArea = useCallback((coordinates: number[][][]): number => {
    if (!coordinates[0] || coordinates[0].length < 3) return 0;
    
    const ring = coordinates[0];
    let area = 0;
    
    for (let i = 0; i < ring.length - 1; i++) {
      const [x1, y1] = ring[i];
      const [x2, y2] = ring[i + 1];
      area += (x1 * y2 - x2 * y1);
    }
    
    return Math.abs(area / 2);
  }, []);

  // Calculate perimeter
  const calculatePerimeter = useCallback((coordinates: number[][][]): number => {
    if (!coordinates[0] || coordinates[0].length < 2) return 0;
    
    const ring = coordinates[0];
    let perimeter = 0;
    
    for (let i = 0; i < ring.length - 1; i++) {
      const [x1, y1] = ring[i];
      const [x2, y2] = ring[i + 1];
      const distance = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
      perimeter += distance;
    }
    
    return perimeter;
  }, []);

  // History management
  const pushToHistory = useCallback(() => {
    const now = Date.now();
    // Debounce history saves (don't save more than once per second)
    if (now - lastSaveTime.current < 1000) return;
    
    lastSaveTime.current = now;
    
    setHistory(prev => {
      const newHistory = prev.slice(0, historyPosition + 1);
      newHistory.push({ features: [...features], timestamp: now });
      
      // Limit history size
      if (newHistory.length > MAX_HISTORY_SIZE) {
        newHistory.shift();
        setHistoryPosition(pos => pos - 1);
        return newHistory;
      }
      
      setHistoryPosition(newHistory.length - 1);
      return newHistory;
    });
  }, [features, historyPosition]);

  const undo = useCallback(() => {
    if (canUndo) {
      const newPosition = historyPosition - 1;
      setHistoryPosition(newPosition);
      setFeatures(history[newPosition].features);
      setSelectedFeatureIds([]);
    }
  }, [canUndo, historyPosition, history]);

  const redo = useCallback(() => {
    if (canRedo) {
      const newPosition = historyPosition + 1;
      setHistoryPosition(newPosition);
      setFeatures(history[newPosition].features);
      setSelectedFeatureIds([]);
    }
  }, [canRedo, historyPosition, history]);

  // Feature management
  const addFeature = useCallback((
    feature: Omit<VectorFeature, 'id' | 'properties'>, 
    zoneType: ZoningType
  ) => {
    const now = new Date().toISOString();
    const area = calculateArea(feature.coordinates);
    const perimeter = calculatePerimeter(feature.coordinates);
    
    const newFeature: VectorFeature = {
      ...feature,
      id: generateId(),
      zoneType,
      properties: {
        area,
        perimeter,
        created: now
      }
    };
    
    setFeatures(prev => [...prev, newFeature]);
    pushToHistory();
  }, [generateId, calculateArea, calculatePerimeter, pushToHistory]);

  const updateFeature = useCallback((id: string, updates: Partial<VectorFeature>) => {
    setFeatures(prev => prev.map(feature => {
      if (feature.id === id) {
        const updated = { ...feature, ...updates };
        
        // Recalculate properties if coordinates changed
        if (updates.coordinates) {
          updated.properties = {
            ...updated.properties,
            area: calculateArea(updates.coordinates),
            perimeter: calculatePerimeter(updates.coordinates),
            modified: new Date().toISOString()
          };
        }
        
        return updated;
      }
      return feature;
    }));
    pushToHistory();
  }, [calculateArea, calculatePerimeter, pushToHistory]);

  const removeFeature = useCallback((id: string) => {
    setFeatures(prev => prev.filter(f => f.id !== id));
    setSelectedFeatureIds(prev => prev.filter(fId => fId !== id));
    pushToHistory();
  }, [pushToHistory]);

  const removeFeatures = useCallback((ids: string[]) => {
    setFeatures(prev => prev.filter(f => !ids.includes(f.id)));
    setSelectedFeatureIds(prev => prev.filter(fId => !ids.includes(fId)));
    pushToHistory();
  }, [pushToHistory]);

  const clearAllFeatures = useCallback(() => {
    setFeatures([]);
    setSelectedFeatureIds([]);
    pushToHistory();
  }, [pushToHistory]);

  // Selection management
  const selectFeature = useCallback((id: string) => {
    setSelectedFeatureIds([id]);
  }, []);

  const selectFeatures = useCallback((ids: string[]) => {
    setSelectedFeatureIds(ids);
  }, []);

  const selectAllFeatures = useCallback(() => {
    setSelectedFeatureIds(features.map(f => f.id));
  }, [features]);

  const clearSelection = useCallback(() => {
    setSelectedFeatureIds([]);
  }, []);

  const toggleFeatureSelection = useCallback((id: string) => {
    setSelectedFeatureIds(prev => 
      prev.includes(id) 
        ? prev.filter(fId => fId !== id)
        : [...prev, id]
    );
  }, []);

  // Spatial operations
  const mergeSelectedFeatures = useCallback((zoneType: ZoningType) => {
    if (selectedFeatures.length < 2) return;
    
    // Simple merge implementation - combine all coordinates
    // In a real implementation, you'd use a proper geometry library
    const mergedCoordinates: number[][][] = [[]];
    selectedFeatures.forEach(feature => {
      if (feature.coordinates[0]) {
        mergedCoordinates[0].push(...feature.coordinates[0]);
      }
    });
    
    const mergedFeature: VectorFeature = {
      id: generateId(),
      type: 'polygon',
      zoneType,
      coordinates: mergedCoordinates,
      properties: {
        area: calculateArea(mergedCoordinates),
        perimeter: calculatePerimeter(mergedCoordinates),
        created: new Date().toISOString()
      }
    };
    
    // Remove original features and add merged one
    removeFeatures(selectedFeatureIds);
    setFeatures(prev => [...prev, mergedFeature]);
    setSelectedFeatureIds([mergedFeature.id]);
  }, [selectedFeatures, selectedFeatureIds, generateId, calculateArea, calculatePerimeter, removeFeatures]);

  const splitFeature = useCallback((id: string, splitLine: number[][]) => {
    // Placeholder implementation - would need proper geometry splitting
    console.log('Split feature:', id, 'with line:', splitLine);
    // In a real implementation, use a library like turf.js
  }, []);

  const bufferFeatures = useCallback((ids: string[], distance: number) => {
    // Placeholder implementation - would need proper geometry buffering
    console.log('Buffer features:', ids, 'distance:', distance);
    // In a real implementation, use a library like turf.js
  }, []);

  // Measurements
  const calculateFeatureArea = useCallback((id: string): number => {
    const feature = features.find(f => f.id === id);
    return feature?.properties.area || 0;
  }, [features]);

  const calculateFeaturePerimeter = useCallback((id: string): number => {
    const feature = features.find(f => f.id === id);
    return feature?.properties.perimeter || 0;
  }, [features]);

  const getTotalArea = useCallback((): number => {
    return features.reduce((total, feature) => total + feature.properties.area, 0);
  }, [features]);

  // Batch operations
  const updateSelectedFeatures = useCallback((updates: Partial<VectorFeature>) => {
    selectedFeatureIds.forEach(id => {
      updateFeature(id, updates);
    });
  }, [selectedFeatureIds, updateFeature]);

  const setZoneTypeForSelected = useCallback((zoneType: ZoningType) => {
    updateSelectedFeatures({ zoneType });
  }, [updateSelectedFeatures]);

  return {
    features,
    selectedFeatures,
    editingMode,
    historyPosition,
    canUndo,
    canRedo,
    snapEnabled,
    snapTolerance,
    
    // Feature management
    addFeature,
    updateFeature,
    removeFeature,
    removeFeatures,
    clearAllFeatures,
    
    // Selection management
    selectFeature,
    selectFeatures,
    selectAllFeatures,
    clearSelection,
    toggleFeatureSelection,
    
    // Editing mode
    setEditingMode,
    
    // History management
    undo,
    redo,
    pushToHistory,
    
    // Spatial operations
    mergeSelectedFeatures,
    splitFeature,
    bufferFeatures,
    
    // Measurements
    calculateFeatureArea,
    calculateFeaturePerimeter,
    getTotalArea,
    
    // Snapping
    setSnapEnabled,
    setSnapTolerance,
    
    // Batch operations
    updateSelectedFeatures,
    setZoneTypeForSelected
  };
};