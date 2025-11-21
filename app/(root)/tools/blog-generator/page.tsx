'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Copy, Download, Zap, RotateCcw, BookOpen, Clock, Volume2 } from 'lucide-react';
import { toast } from 'sonner';

export default function BlogGenerator() {
  const [topic, setTopic] = useState('');
  const [tone, setTone] = useState('professional');
  const [length, setLength] = useState('medium');
  const [keywords, setKeywords] = useState('');
  const [targetAudience, setTargetAudience] = useState('');
  const [generatedContent, setGeneratedContent] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [wordCount, setWordCount] = useState(0);

  const tones = [
    { value: 'professional', label: 'Professional', emoji: '💼' },
    { value: 'casual', label: 'Casual', emoji: '😊' },
    { value: 'enthusiastic', label: 'Enthusiastic', emoji: '🚀' },
    { value: 'humorous', label: 'Humorous', emoji: '😂' },
    { value: 'authoritative', label: 'Authoritative', emoji: '👑' },
    { value: 'friendly', label: 'Friendly', emoji: '🤝' },
  ];

  const lengths = [
    { value: 'short', label: 'Short', words: '300-400 words', emoji: '📝' },
    { value: 'medium', label: 'Medium', words: '600-800 words', emoji: '📄' },
    { value: 'long', label: 'Long', words: '1000-1200 words', emoji: '📑' },
  ];

  const generateBlog = async () => {
    if (!topic.trim()) {
      toast.error('Please enter a blog topic');
      return;
    }

    setIsGenerating(true);
    setGeneratedContent('');
    
    try {
      const response = await fetch('/api/tools/blog-generator', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          topic,
          tone,
          length,
          keywords: keywords.split(',').map(k => k.trim()).filter(k => k),
          targetAudience,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate blog');
      }

      const data = await response.json();
      setGeneratedContent(data.content);
      setWordCount(data.content.split(/\s+/).length);
      toast.success('Blog post generated successfully!');
    } catch (error) {
      console.error('Error generating blog:', error);
      toast.error('Error generating blog. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generatedContent);
      toast.success('Copied to clipboard!');
    } catch (error) {
      toast.error('Failed to copy to clipboard');
    }
  };

  const downloadAsText = () => {
    const element = document.createElement('a');
    const file = new Blob([generatedContent], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `blog-post-${topic.toLowerCase().replace(/\s+/g, '-')}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    toast.success('Blog post downloaded!');
  };

  const resetForm = () => {
    setTopic('');
    setTone('professional');
    setLength('medium');
    setKeywords('');
    setTargetAudience('');
    setGeneratedContent('');
    setWordCount(0);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900/20 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600">
              <BookOpen className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              AI Blog Generator
            </h1>
          </div>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Create engaging, SEO-friendly blog posts in seconds with the power of AI
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="space-y-6">
            <Card className="border-2 border-blue-100 dark:border-blue-900/30 shadow-lg">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-xl">
                  <Zap className="h-5 w-5 text-yellow-500" />
                  Blog Details
                </CardTitle>
                <CardDescription>
                  Fill in the details to generate your perfect blog post
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Blog Topic *
                  </label>
                  <Input
                    placeholder="e.g., The Future of Artificial Intelligence in Healthcare"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    className="h-12 text-lg"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Target Audience
                  </label>
                  <Input
                    placeholder="e.g., Tech professionals, Students, Small business owners"
                    value={targetAudience}
                    onChange={(e) => setTargetAudience(e.target.value)}
                    className="h-12"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Keywords (comma separated)
                  </label>
                  <Input
                    placeholder="e.g., AI, machine learning, healthcare technology"
                    value={keywords}
                    onChange={(e) => setKeywords(e.target.value)}
                    className="h-12"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                      <Volume2 className="h-4 w-4" />
                      Tone
                    </label>
                    <Select value={tone} onValueChange={setTone}>
                      <SelectTrigger className="h-12">
                        <SelectValue placeholder="Select tone" />
                      </SelectTrigger>
                      <SelectContent>
                        {tones.map((toneOption) => (
                          <SelectItem key={toneOption.value} value={toneOption.value}>
                            <span className="flex items-center gap-2">
                              {toneOption.emoji} {toneOption.label}
                            </span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      Length
                    </label>
                    <Select value={length} onValueChange={setLength}>
                      <SelectTrigger className="h-12">
                        <SelectValue placeholder="Select length" />
                      </SelectTrigger>
                      <SelectContent>
                        {lengths.map((lengthOption) => (
                          <SelectItem key={lengthOption.value} value={lengthOption.value}>
                            <span className="flex items-center gap-2">
                              {lengthOption.emoji} {lengthOption.label}
                              <Badge variant="secondary" className="ml-2 text-xs">
                                {lengthOption.words}
                              </Badge>
                            </span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    onClick={generateBlog}
                    disabled={isGenerating || !topic.trim()}
                    className="flex-1 h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold text-lg"
                  >
                    {isGenerating ? (
                      <span className="flex items-center gap-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Generating...
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <Sparkles className="h-5 w-5" />
                        Generate Blog Post
                      </span>
                    )}
                  </Button>
                  
                  <Button
                    onClick={resetForm}
                    variant="outline"
                    className="h-12"
                    disabled={isGenerating}
                  >
                    <RotateCcw className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Tips Card */}
            <Card className="bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800">
              <CardContent className="pt-6">
                <h3 className="font-semibold text-amber-800 dark:text-amber-300 mb-2 flex items-center gap-2">
                  💡 Pro Tips
                </h3>
                <ul className="text-sm text-amber-700 dark:text-amber-400 space-y-1">
                  <li>• Be specific with your topic for better results</li>
                  <li>• Include relevant keywords for SEO optimization</li>
                  <li>• Consider your target audience when choosing tone</li>
                  <li>• Use medium length for comprehensive coverage</li>
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Output Section */}
          <div className="space-y-6">
            <Card className="border-2 border-green-100 dark:border-green-900/30 shadow-lg h-full">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2 text-xl">
                    <BookOpen className="h-5 w-5 text-green-500" />
                    Generated Blog Post
                  </CardTitle>
                  {wordCount > 0 && (
                    <Badge variant="secondary" className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300">
                      {wordCount} words
                    </Badge>
                  )}
                </div>
                <CardDescription>
                  Your AI-generated blog post will appear here
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {generatedContent ? (
                  <>
                    <Textarea
                      value={generatedContent}
                      readOnly
                      className="min-h-[500px] font-mono text-sm leading-relaxed resize-none bg-gray-50 dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700"
                    />
                    <div className="flex gap-3">
                      <Button
                        onClick={copyToClipboard}
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                      >
                        <Copy className="h-4 w-4 mr-2" />
                        Copy to Clipboard
                      </Button>
                      <Button
                        onClick={downloadAsText}
                        variant="outline"
                        className="flex-1"
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                    </div>
                  </>
                ) : (
                  <div className="min-h-[500px] flex items-center justify-center border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50/50 dark:bg-gray-900/50">
                    {isGenerating ? (
                      <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                        <p className="text-gray-600 dark:text-gray-400 font-medium">
                          AI is crafting your blog post...
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
                          This may take a few seconds
                        </p>
                      </div>
                    ) : (
                      <div className="text-center text-gray-400 dark:text-gray-500">
                        <BookOpen className="h-16 w-16 mx-auto mb-4 opacity-50" />
                        <p className="font-medium">Your blog post will appear here</p>
                        <p className="text-sm mt-1">Fill in the details and click generate</p>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Features Grid */}
        <div className="mt-12 grid md:grid-cols-3 gap-6">
          <Card className="text-center p-6 border-2 border-blue-100 dark:border-blue-900/30">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <Zap className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Lightning Fast</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Generate high-quality blog posts in under 30 seconds
            </p>
          </Card>

          <Card className="text-center p-6 border-2 border-green-100 dark:border-green-900/30">
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <Sparkles className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="font-semibold text-lg mb-2">AI Optimized</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Advanced AI models trained on professional content
            </p>
          </Card>

          <Card className="text-center p-6 border-2 border-purple-100 dark:border-purple-900/30">
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <BookOpen className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
            <h3 className="font-semibold text-lg mb-2">SEO Ready</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Built-in SEO optimization and keyword integration
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}