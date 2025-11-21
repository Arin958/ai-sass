// components/resume-generator.tsx
'use client';

import { useState } from 'react';
import { Sparkles, Download, Copy, RefreshCw, Plus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';

export function ResumeGenerator() {
  const [formData, setFormData] = useState({
    jobTitle: '',
    experience: 'mid-level',
    skills: [''],
  });
  const [generatedResume, setGeneratedResume] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState('input');

  const experienceLevels = [
    { value: 'entry-level', label: 'Entry Level (0-2 years)' },
    { value: 'mid-level', label: 'Mid Level (3-7 years)' },
    { value: 'senior', label: 'Senior (8+ years)' },
    { value: 'executive', label: 'Executive (15+ years)' },
  ];

  const addSkill = () => {
    setFormData(prev => ({
      ...prev,
      skills: [...prev.skills, '']
    }));
  };

  const updateSkill = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.map((skill, i) => i === index ? value : skill)
    }));
  };

  const removeSkill = (index: number) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== index)
    }));
  };

  const generateResume = async () => {
    if (!formData.jobTitle.trim()) {
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/tools/resume-generator', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          jobTitle: formData.jobTitle,
          experience: formData.experience,
          skills: formData.skills.filter(skill => skill.trim() !== ''),
        }),
      });

      const data = await response.json();
      
      if (response.ok) {
        setGeneratedResume(data.output);
        setActiveTab('output');
      } else {
        console.error('Generation failed:', data.error);
      }
    } catch (error) {
      console.error('Error generating resume:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(generatedResume);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadResume = () => {
    const blob = new Blob([generatedResume], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `resume-${formData.jobTitle.toLowerCase().replace(/\s+/g, '-')}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const resetForm = () => {
    setFormData({
      jobTitle: '',
      experience: 'mid-level',
      skills: [''],
    });
    setGeneratedResume('');
    setActiveTab('input');
  };

  const validSkills = formData.skills.filter(skill => skill.trim() !== '');

  return (
    <div className="w-full max-w-6xl mx-auto p-6 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">AI Resume Generator</h1>
        <p className="text-muted-foreground">
          Create professional, ATS-friendly resumes tailored to your target role
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="input">Resume Details</TabsTrigger>
          <TabsTrigger value="output" disabled={!generatedResume}>
            Generated Resume
          </TabsTrigger>
        </TabsList>

        <TabsContent value="input">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                Tell us about your target role
              </CardTitle>
              <CardDescription>
                Provide details about the position you&apos;re targeting and your experience level
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="jobTitle">Job Title *</Label>
                <Input
                  id="jobTitle"
                  placeholder="e.g., Senior Frontend Developer, Data Scientist, Product Manager"
                  value={formData.jobTitle}
                  onChange={(e) => setFormData(prev => ({ ...prev, jobTitle: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="experience">Experience Level</Label>
                <Select value={formData.experience} onValueChange={(value) => setFormData(prev => ({ ...prev, experience: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {experienceLevels.map(level => (
                      <SelectItem key={level.value} value={level.value}>
                        {level.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label>Skills & Technologies</Label>
                  <Button type="button" variant="outline" size="sm" onClick={addSkill}>
                    <Plus className="h-4 w-4 mr-1" />
                    Add Skill
                  </Button>
                </div>
                
                <div className="space-y-2">
                  {formData.skills.map((skill, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        placeholder="e.g., React, Python, Project Management"
                        value={skill}
                        onChange={(e) => updateSkill(index, e.target.value)}
                      />
                      {formData.skills.length > 1 && (
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={() => removeSkill(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>

                {validSkills.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {validSkills.map((skill, index) => (
                      <Badge key={index} variant="secondary">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex gap-3 pt-4">
                <Button 
                  onClick={generateResume} 
                  disabled={!formData.jobTitle.trim() || isLoading}
                  className="flex-1"
                >
                  {isLoading ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4 mr-2" />
                      Generate Resume
                    </>
                  )}
                </Button>
                
                <Button variant="outline" onClick={resetForm}>
                  Reset
                </Button>
              </div>

              <Alert>
                <AlertDescription className="text-sm">
                  Our AI will create a professional resume tailored to your specified role, 
                  including relevant experience, skills highlighting, and industry-standard formatting.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="output">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Your Generated Resume</span>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={copyToClipboard}>
                    <Copy className="h-4 w-4 mr-2" />
                    {copied ? 'Copied!' : 'Copy'}
                  </Button>
                  <Button variant="outline" size="sm" onClick={downloadResume}>
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => setActiveTab('input')}>
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Regenerate
                  </Button>
                </div>
              </CardTitle>
              <CardDescription>
                Tailored for {formData.jobTitle} position ({formData.experience} level)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border rounded-lg p-6 bg-muted/50">
                <div className="prose prose-sm max-w-none">
                  <pre className="whitespace-pre-wrap font-sans text-sm">
                    {generatedResume}
                  </pre>
                </div>
              </div>
              
              <div className="mt-6 p-4 border rounded-lg bg-blue-50 dark:bg-blue-950">
                <h4 className="font-semibold mb-2">💡 Pro Tips</h4>
                <ul className="text-sm space-y-1 text-blue-900 dark:text-blue-100">
                  <li>• Review and customize the generated content with your actual experience</li>
                  <li>• Add specific metrics and achievements where possible</li>
                  <li>• Ensure all dates and company names are accurate</li>
                  <li>• Tailor the skills section to match the job description</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}