// components/resume-generator.tsx
'use client';

import { useState } from 'react';
import { Sparkles, Download, Copy, RefreshCw, Plus, X, User, Briefcase, Award, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Switch } from '@/components/ui/switch';
import { Progress } from '@/components/ui/progress';

export function ResumeGenerator() {
  const [formData, setFormData] = useState({
    jobTitle: '',
    experience: 'mid-level',
    skills: [''],
    achievements: '',
    includeSummary: true,
    includeProjects: true,
  });
  const [generatedResume, setGeneratedResume] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState('input');
  const [previewMode, setPreviewMode] = useState(false);

  const experienceLevels = [
    { value: 'entry-level', label: 'Entry Level (0-2 years)', description: 'Focus on education and foundational skills' },
    { value: 'mid-level', label: 'Mid Level (3-7 years)', description: 'Highlight project experience and technical expertise' },
    { value: 'senior', label: 'Senior (8+ years)', description: 'Emphasize leadership and strategic impact' },
    { value: 'executive', label: 'Executive (15+ years)', description: 'Showcase business impact and leadership' },
  ];

  const getCompletionPercentage = () => {
    let percentage = 0;
    if (formData.jobTitle.trim()) percentage += 40;
    if (formData.skills.some(skill => skill.trim() !== '')) percentage += 30;
    if (formData.achievements.trim()) percentage += 20;
    percentage += 10; // Base for experience level
    return Math.min(percentage, 100);
  };

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
          achievements: formData.achievements,
          includeSummary: formData.includeSummary,
          includeProjects: formData.includeProjects,
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
      achievements: '',
      includeSummary: true,
      includeProjects: true,
    });
    setGeneratedResume('');
    setActiveTab('input');
  };

  const validSkills = formData.skills.filter(skill => skill.trim() !== '');
  const completionPercentage = getCompletionPercentage();

  return (
    <div className="w-full max-w-6xl mx-auto p-6 space-y-6">
      <div className="text-center space-y-4">
        <div className="flex justify-center items-center gap-3">
          <div className="p-3 bg-primary/10 rounded-full">
            <Sparkles className="h-8 w-8 text-primary" />
          </div>
        </div>
        <h1 className="text-4xl font-bold tracking-tight bg-linear-to-r from-primary to-primary/60 bg-clip-text text-transparent">
          AI Resume Generator
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Create professional, ATS-friendly resumes tailored to your target role in seconds
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-8">
          <TabsTrigger value="input" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            Resume Details
          </TabsTrigger>
          <TabsTrigger value="output" disabled={!generatedResume} className="flex items-center gap-2">
            <Briefcase className="h-4 w-4" />
            Generated Resume
          </TabsTrigger>
        </TabsList>

        <TabsContent value="input">
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Main Form */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2 text-xl">
                    <Sparkles className="h-5 w-5 text-primary" />
                    Target Role Information
                  </CardTitle>
                  <CardDescription>
                    Provide details about the position you&apos;re targeting
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Progress Bar */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Profile completion</span>
                      <span>{completionPercentage}%</span>
                    </div>
                    <Progress value={completionPercentage} className="h-2" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="jobTitle" className="text-base">
                      Job Title *
                    </Label>
                    <Input
                      id="jobTitle"
                      placeholder="e.g., Senior Frontend Developer, Data Scientist, Product Manager"
                      value={formData.jobTitle}
                      onChange={(e) => setFormData(prev => ({ ...prev, jobTitle: e.target.value }))}
                      className="h-12 text-base"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="experience" className="text-base">
                      Experience Level
                    </Label>
                    <Select value={formData.experience} onValueChange={(value) => setFormData(prev => ({ ...prev, experience: value }))}>
                      <SelectTrigger className="h-12 text-base">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {experienceLevels.map(level => (
                          <SelectItem key={level.value} value={level.value} className="text-base">
                            <div>
                              <div className="font-medium">{level.label}</div>
                              <div className="text-sm text-muted-foreground">{level.description}</div>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="achievements" className="text-base">
                      Key Achievements
                    </Label>
                    <Textarea
                      id="achievements"
                      placeholder="Describe your notable achievements, projects, or impact metrics..."
                      value={formData.achievements}
                      onChange={(e) => setFormData(prev => ({ ...prev, achievements: e.target.value }))}
                      className="min-h-[100px] resize-vertical text-base"
                    />
                    <p className="text-sm text-muted-foreground">
                      Include quantifiable results like &quot;Increased performance by 30%&quot; or &quot;Led a team of 5 developers&quot;
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2 text-xl">
                    <Award className="h-5 w-5 text-primary" />
                    Skills & Technologies
                  </CardTitle>
                  <CardDescription>
                    Add relevant skills and technologies for your target role
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label className="text-base">Skills & Technologies</Label>
                      <Button type="button" variant="outline" size="sm" onClick={addSkill}>
                        <Plus className="h-4 w-4 mr-1" />
                        Add Skill
                      </Button>
                    </div>
                    
                    <div className="space-y-2">
                      {formData.skills.map((skill, index) => (
                        <div key={index} className="flex gap-2">
                          <Input
                            placeholder="e.g., React, Python, Project Management, AWS"
                            value={skill}
                            onChange={(e) => updateSkill(index, e.target.value)}
                            className="text-base"
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
                      <div className="flex flex-wrap gap-2 pt-2">
                        {validSkills.map((skill, index) => (
                          <Badge key={index} variant="secondary" className="text-sm py-1.5 px-3">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <Card>
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg">Resume Options</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between space-y-0">
                    <Label htmlFor="includeSummary" className="text-sm font-normal">
                      Include Professional Summary
                    </Label>
                    <Switch
                      id="includeSummary"
                      checked={formData.includeSummary}
                      onCheckedChange={(checked: boolean) => setFormData(prev => ({ ...prev, includeSummary: checked }))}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between space-y-0">
                    <Label htmlFor="includeProjects" className="text-sm font-normal">
                      Include Projects Section
                    </Label>
                    <Switch
                      id="includeProjects"
                      checked={formData.includeProjects}
                      onCheckedChange={(checked: boolean) => setFormData(prev => ({ ...prev, includeProjects: checked }))}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg">Generate Resume</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button 
                    onClick={generateResume} 
                    disabled={!formData.jobTitle.trim() || isLoading}
                    className="w-full h-12 text-base"
                    size="lg"
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
                  
                  <Button variant="outline" onClick={resetForm} className="w-full">
                    Reset Form
                  </Button>

                  <Alert className="mt-4">
                    <AlertDescription className="text-sm">
                      Our AI creates professional resumes optimized for Applicant Tracking Systems (ATS) 
                      and human recruiters, tailored to your experience level and target role.
                    </AlertDescription>
                  </Alert>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="output">
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <CardTitle className="flex items-center gap-2 text-2xl">
                    <Briefcase className="h-6 w-6 text-primary" />
                    Your Generated Resume
                  </CardTitle>
                  <CardDescription className="text-base">
                    Tailored for <strong>{formData.jobTitle}</strong> position 
                    ({experienceLevels.find(l => l.value === formData.experience)?.label})
                  </CardDescription>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setPreviewMode(!previewMode)}
                    className="flex items-center gap-2"
                  >
                    {previewMode ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    {previewMode ? 'Raw Text' : 'Preview'}
                  </Button>
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
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="border rounded-lg p-6 bg-muted/50 min-h-[500px]">
                {previewMode ? (
                  <div className="prose prose-lg max-w-none">
                    <div className="whitespace-pre-wrap font-sans text-gray-800 leading-relaxed">
                      {generatedResume.split('\n').map((line, index) => {
                        if (line.startsWith('# ')) {
                          return <h1 key={index} className="text-2xl font-bold mt-6 mb-4 text-primary border-b pb-2">{line.replace('# ', '')}</h1>;
                        } else if (line.startsWith('## ')) {
                          return <h2 key={index} className="text-xl font-semibold mt-5 mb-3 text-gray-900">{line.replace('## ', '')}</h2>;
                        } else if (line.startsWith('### ')) {
                          return <h3 key={index} className="text-lg font-medium mt-4 mb-2 text-gray-800">{line.replace('### ', '')}</h3>;
                        } else if (line.startsWith('- ')) {
                          return <li key={index} className="ml-4 mb-1 text-gray-700">{line.replace('- ', '')}</li>;
                        } else if (line.trim() === '') {
                          return <br key={index} />;
                        } else {
                          return <p key={index} className="mb-3 text-gray-700 leading-relaxed">{line}</p>;
                        }
                      })}
                    </div>
                  </div>
                ) : (
                  <div className="prose prose-sm max-w-none">
                    <pre className="whitespace-pre-wrap font-mono text-sm bg-transparent p-0">
                      {generatedResume}
                    </pre>
                  </div>
                )}
              </div>
              
              <div className="grid gap-6 md:grid-cols-2">
                <div className="p-4 border rounded-lg bg-blue-50 dark:bg-blue-950">
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <Sparkles className="h-4 w-4" />
                    Pro Tips
                  </h4>
                  <ul className="text-sm space-y-2 text-blue-900 dark:text-blue-100">
                    <li>• Review and customize the generated content with your actual experience</li>
                    <li>• Add specific metrics and achievements where possible</li>
                    <li>• Ensure all dates and company names are accurate</li>
                    <li>• Tailor the skills section to match the job description</li>
                    <li>• Use action verbs and quantify your accomplishments</li>
                  </ul>
                </div>

                <div className="p-4 border rounded-lg bg-green-50 dark:bg-green-950">
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <Award className="h-4 w-4" />
                    Next Steps
                  </h4>
                  <ul className="text-sm space-y-2 text-green-900 dark:text-green-100">
                    <li>• Save your resume as a PDF for applications</li>
                    <li>• Update your LinkedIn profile to match</li>
                    <li>• Prepare specific examples for each bullet point</li>
                    <li>• Customize for each job application</li>
                    <li>• Practice explaining your career journey</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}