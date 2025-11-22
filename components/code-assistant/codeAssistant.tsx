'use client';

import { useState } from 'react';
import { 
  Code2, 
  Bug, 
  Zap, 
  Play, 
  Copy, 
  Download, 
  RefreshCw, 
  Sparkles, 
  Brain, 
  Shield,
  CheckCircle,
  AlertTriangle,
  Monitor,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';

export function CodeAssistant() {
  const [formData, setFormData] = useState({
    code: '',
    language: 'javascript',
    mode: 'explain'
  });
  const [generatedExplanation, setGeneratedExplanation] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState('input');
  const [theme, setTheme] = useState('dark');
  const [fontSize, setFontSize] = useState('14');
  const [showLineNumbers, setShowLineNumbers] = useState(true);

  const programmingLanguages = [
    { value: 'javascript', label: 'JavaScript', icon: '🟨' },
    { value: 'typescript', label: 'TypeScript', icon: '🔷' },
    { value: 'python', label: 'Python', icon: '🐍' },
    { value: 'java', label: 'Java', icon: '☕' },
    { value: 'cpp', label: 'C++', icon: '⚙️' },
    { value: 'csharp', label: 'C#', icon: '🎯' },
    { value: 'php', label: 'PHP', icon: '🐘' },
    { value: 'ruby', label: 'Ruby', icon: '💎' },
    { value: 'go', label: 'Go', icon: '🐹' },
    { value: 'rust', label: 'Rust', icon: '🦀' },
    { value: 'swift', label: 'Swift', icon: '🐦' },
    { value: 'kotlin', label: 'Kotlin', icon: '🔶' },
  ];

  const assistantModes = [
    { 
      value: 'explain', 
      label: 'Explain Code', 
      description: 'Get detailed explanations of how code works',
      icon: Brain,
      color: 'text-blue-500'
    },
    { 
      value: 'debug', 
      label: 'Debug & Fix', 
      description: 'Identify and fix bugs in your code',
      icon: Bug,
      color: 'text-red-500'
    },
    { 
      value: 'optimize', 
      label: 'Optimize', 
      description: 'Improve performance and efficiency',
      icon: Zap,
      color: 'text-green-500'
    },
  ];

  const getModeIcon = (mode: string) => {
    const modeConfig = assistantModes.find(m => m.value === mode);
    return modeConfig ? modeConfig.icon : Code2;
  };

  const generateExplanation = async () => {
    if (!formData.code.trim()) {
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/tools/code-assistant', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      
      if (response.ok) {
        setGeneratedExplanation(data.explanation);
        setActiveTab('output');
      } else {
        console.error('Generation failed:', data.error);
      }
    } catch (error) {
      console.error('Error generating explanation:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(generatedExplanation);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadExplanation = () => {
    const blob = new Blob([generatedExplanation], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `code-explanation-${formData.language}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const resetForm = () => {
    setFormData({
      code: '',
      language: 'javascript',
      mode: 'explain'
    });
    setGeneratedExplanation('');
    setActiveTab('input');
  };

  const insertSampleCode = () => {
    const samples = {
      javascript: `function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

console.log(fibonacci(10));`,
      python: `def fibonacci(n):
    if n <= 1:
        return n
    return fibonacci(n-1) + fibonacci(n-2)

print(fibonacci(10))`,
      java: `public class Fibonacci {
    public static int fibonacci(int n) {
        if (n <= 1) return n;
        return fibonacci(n-1) + fibonacci(n-2);
    }
    
    public static void main(String[] args) {
        System.out.println(fibonacci(10));
    }
}`
    };
    
    setFormData(prev => ({
      ...prev,
      code: samples[formData.language as keyof typeof samples] || samples.javascript
    }));
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex justify-center items-center gap-3">
          <div className="p-3 bg-linear-to-br from-blue-500 to-purple-600 rounded-2xl shadow-lg">
            <Code2 className="h-8 w-8 text-white" />
          </div>
        </div>
        <h1 className="text-4xl font-bold bg-linear-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent">
          AI Code Assistant
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Your intelligent programming partner. Explain, debug, and optimize code with AI-powered insights.
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-8 bg-muted/50 p-1 rounded-2xl">
          <TabsTrigger value="input" className="flex items-center gap-2 rounded-xl data-[state=active]:bg-background data-[state=active]:shadow-sm">
            <Code2 className="h-4 w-4" />
            Code Input
          </TabsTrigger>
          <TabsTrigger 
            value="output" 
            disabled={!generatedExplanation} 
            className="flex items-center gap-2 rounded-xl data-[state=active]:bg-background data-[state=active]:shadow-sm"
          >
            <Sparkles className="h-4 w-4" />
            AI Analysis
          </TabsTrigger>
        </TabsList>

        <TabsContent value="input">
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Main Editor Section */}
            <div className="lg:col-span-2 space-y-6">
              <Card className="border-0 shadow-lg bg-linear-to-br from-background to-muted/20">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2 text-xl">
                      <Monitor className="h-5 w-5 text-blue-500" />
                      Code Editor
                    </CardTitle>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" onClick={insertSampleCode}>
                        <Play className="h-4 w-4 mr-2" />
                        Sample Code
                      </Button>
                    </div>
                  </div>
                  <CardDescription>
                    Paste your code or start typing. The AI will analyze it based on your selected mode.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="language" className="text-sm font-medium">
                        Programming Language
                      </Label>
                      <Select value={formData.language} onValueChange={(value) => setFormData(prev => ({ ...prev, language: value }))}>
                        <SelectTrigger className="h-10">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {programmingLanguages.map(lang => (
                            <SelectItem key={lang.value} value={lang.value}>
                              <div className="flex items-center gap-2">
                                <span>{lang.icon}</span>
                                <span>{lang.label}</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="mode" className="text-sm font-medium">
                        Assistant Mode
                      </Label>
                      <Select value={formData.mode} onValueChange={(value) => setFormData(prev => ({ ...prev, mode: value }))}>
                        <SelectTrigger className="h-10">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {assistantModes.map(mode => {
                            const IconComponent = mode.icon;
                            return (
                              <SelectItem key={mode.value} value={mode.value}>
                                <div className="flex items-center gap-2">
                                  <IconComponent className={`h-4 w-4 ${mode.color}`} />
                                  <div>
                                    <div className="font-medium">{mode.label}</div>
                                    <div className="text-xs text-muted-foreground">{mode.description}</div>
                                  </div>
                                </div>
                              </SelectItem>
                            );
                          })}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="code" className="text-sm font-medium">
                        Your Code
                      </Label>
                      <Badge variant="secondary" className="font-mono">
                        {formData.language}
                      </Badge>
                    </div>
                    <div className="border rounded-lg overflow-hidden bg-linear-to-b from-muted/50 to-background">
                      <Textarea
                        id="code"
                        placeholder={`Enter your ${formData.language} code here...\n\n// Example:\nfunction example() {\n  return "Hello, World!";\n}`}
                        value={formData.code}
                        onChange={(e) => setFormData(prev => ({ ...prev, code: e.target.value }))}
                        className="min-h-[400px] font-mono text-sm resize-none border-0 focus-visible:ring-0 bg-transparent"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Mode Info Card */}
              <Card className="bg-linear-to-br from-blue-50 to-blue-100 dark:from-blue-950/20 dark:to-blue-900/20 border-blue-200 dark:border-blue-800">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    {(() => {
                      const IconComponent = getModeIcon(formData.mode);
                      const modeConfig = assistantModes.find(m => m.value === formData.mode);
                      return (
                        <>
                          <IconComponent className={`h-5 w-5 ${modeConfig?.color}`} />
                          {modeConfig?.label}
                        </>
                      );
                    })()}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-muted-foreground">
                    {assistantModes.find(m => m.value === formData.mode)?.description}
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>AI-powered analysis</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Shield className="h-4 w-4 text-blue-500" />
                      <span>Secure & private</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Sparkles className="h-4 w-4 text-purple-500" />
                      <span>Instant results</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Action Card */}
              <Card>
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg">Analyze Code</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button 
                    onClick={generateExplanation} 
                    disabled={!formData.code.trim() || isLoading}
                    className="w-full h-12 bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg"
                    size="lg"
                  >
                    {isLoading ? (
                      <>
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-4 w-4 mr-2" />
                        Analyze Code
                      </>
                    )}
                  </Button>
                  
                  <Button variant="outline" onClick={resetForm} className="w-full">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Reset
                  </Button>

                  <Separator />

                  <div className="space-y-3">
                    <Label className="text-sm font-medium">Editor Settings</Label>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Dark Theme</span>
                        <Switch
                          checked={theme === 'dark'}
                          onCheckedChange={(checked) => setTheme(checked ? 'dark' : 'light')}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Line Numbers</span>
                        <Switch
                          checked={showLineNumbers}
                          onCheckedChange={setShowLineNumbers}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm">Font Size: {fontSize}px</Label>
                        <Input
                          type="range"
                          min="12"
                          max="18"
                          value={fontSize}
                          onChange={(e) => setFontSize(e.target.value)}
                          className="w-full"
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Tips Card */}
              <Card className="bg-linear-to-br from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-900/20 border-purple-200 dark:border-purple-800">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Zap className="h-5 w-5 text-purple-500" />
                    Pro Tips
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-2 text-sm">
                    <div className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-purple-500 rounded-full mt-1.5 shrink-0" />
                      <span>Include relevant context and error messages</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-purple-500 rounded-full mt-1.5 shrink-0" />
                      <span>Use specific variable names for better analysis</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-purple-500 rounded-full mt-1.5 shrink-0" />
                      <span>Break down complex problems into smaller parts</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="output">
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Input Code Preview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Code2 className="h-5 w-5 text-blue-500" />
                  Your Code
                </CardTitle>
                <CardDescription>
                  Original input code in {formData.language}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="border rounded-lg bg-linear-to-b from-muted/50 to-background p-4">
                  <pre className="text-sm font-mono whitespace-pre-wrap bg-transparent">
                    {formData.code}
                  </pre>
                </div>
              </CardContent>
            </Card>

            {/* AI Analysis Output */}
            <Card className="bg-linear-to-br from-green-50 to-emerald-100 dark:from-green-950/20 dark:to-emerald-900/20 border-green-200 dark:border-green-800">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-green-500" />
                    AI Analysis
                  </CardTitle>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={copyToClipboard}>
                      <Copy className="h-4 w-4 mr-2" />
                      {copied ? 'Copied!' : 'Copy'}
                    </Button>
                    <Button variant="outline" size="sm" onClick={downloadExplanation}>
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                  </div>
                </div>
                <CardDescription>
                  {assistantModes.find(m => m.value === formData.mode)?.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="border rounded-lg bg-white/50 dark:bg-black/20 p-4 min-h-[200px]">
                  <div className="prose prose-sm max-w-none dark:prose-invert">
                    <div className="whitespace-pre-wrap text-sm leading-relaxed">
                      {generatedExplanation}
                    </div>
                  </div>
                </div>
                
                <Alert className="bg-blue-50 border-blue-200 dark:bg-blue-950/20 dark:border-blue-800">
                  <AlertTriangle className="h-4 w-4 text-blue-600" />
                  <AlertDescription className="text-sm text-blue-800 dark:text-blue-300">
                    This AI analysis is a helpful guide. Always review and test the suggestions in your development environment.
                  </AlertDescription>
                </Alert>

                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    onClick={() => setActiveTab('input')}
                    className="flex-1"
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Analyze New Code
                  </Button>
                  <Button 
                    onClick={generateExplanation}
                    disabled={isLoading}
                    className="flex-1 bg-linear-to-r from-blue-600 to-purple-600"
                  >
                    <Sparkles className="h-4 w-4 mr-2" />
                    Re-analyze
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}