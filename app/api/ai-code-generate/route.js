import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { prompt, existingCode, fileName, context } = await request.json();

    const baseUrl = process.env.NEXT_PUBLIC_DIFY_BASE_URL;
    const apiKey = process.env.NEXT_PUBLIC_DIFY_API_KEY;
    
    if (!baseUrl || !apiKey) {
      return NextResponse.json({ error: 'Missing Dify configuration' }, { status: 500 });
    }

    // Build a specialized prompt for code generation
    const codePrompt = `You're an expert Python developer helping with ${context} code.

Current context:
- File: ${fileName}
- User request: ${prompt}
${existingCode ? `- Existing code:\n\`\`\`python\n${existingCode}\n\`\`\`` : '- Creating new file'}

Please provide clean, well-commented Python code that:
1. Follows Python best practices
2. Includes proper error handling
3. Has clear function/variable names
4. Includes docstrings for functions
5. Is suitable for ${context} pipelines

Return ONLY the Python code, no explanations:`;

    const response = await fetch(`${baseUrl}/v1/chat-messages`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        inputs: {},
        query: codePrompt,
        response_mode: 'blocking',
        user: 'code-generator'
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    // Extract code from response (remove markdown formatting if present)
    let code = data.answer || '';
    code = code.replace(/```python\n?/g, '').replace(/```\n?/g, '');
    
    return NextResponse.json({ code });

  } catch (error) {
    console.error('AI code generation error:', error);
    return NextResponse.json({ error: 'Failed to generate code' }, { status: 500 });
  }
}