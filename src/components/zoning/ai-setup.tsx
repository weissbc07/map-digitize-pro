import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Sparkles, Key } from 'lucide-react';
import { initializeOpenAI } from '@/services/ai-vision';

interface AISetupProps {
  onAIEnabled: () => void;
  isAIEnabled: boolean;
}

export const AISetup = ({ onAIEnabled, isAIEnabled }: AISetupProps) => {
  const [apiKey, setApiKey] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleEnableAI = async () => {
    if (!apiKey.trim()) {
      setError('Please enter your OpenAI API key');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      initializeOpenAI(apiKey.trim());
      localStorage.setItem('openai_api_key', apiKey.trim());
      onAIEnabled();
    } catch (err) {
      setError('Failed to initialize OpenAI. Please check your API key.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDisableAI = () => {
    localStorage.removeItem('openai_api_key');
    setApiKey('');
    onAIEnabled();
  };

  if (isAIEnabled) {
    return (
      <Card className="mb-6">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              <CardTitle className="text-lg">AI Assistant Active</CardTitle>
            </div>
            <Button variant="outline" size="sm" onClick={handleDisableAI}>
              Disconnect
            </Button>
          </div>
          <CardDescription>
            GPT-4v is ready to help with automated map alignment and coordinate detection.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="mb-6">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-muted-foreground" />
          <CardTitle>Enable AI Assistant</CardTitle>
        </div>
        <CardDescription>
          Connect OpenAI GPT-4v for automated map alignment and smart coordinate detection.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="api-key">OpenAI API Key</Label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Key className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="api-key"
                  type="password"
                  placeholder="sk-..."
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button 
                onClick={handleEnableAI} 
                disabled={isLoading || !apiKey.trim()}
              >
                {isLoading ? 'Connecting...' : 'Enable AI'}
              </Button>
            </div>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Alert>
            <AlertDescription>
              Your API key is stored locally in your browser and is only used to communicate directly with OpenAI's servers. 
              Get your API key from <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer" className="underline">OpenAI Platform</a>.
            </AlertDescription>
          </Alert>
        </div>
      </CardContent>
    </Card>
  );
};