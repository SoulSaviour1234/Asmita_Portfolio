import { NextResponse } from 'next/server';

export async function GET() {
    const pat = process.env.GITHUB_PAT;
    const userName = "mishraasmita885-gif"; // Asmita's GitHub username

    if (!pat) {
        return NextResponse.json({ error: 'GitHub PAT is missing or invalid in environment variables' }, { status: 400 });
    }

    const query = `
    query($userName:String!) {
      user(login: $userName){
        contributionsCollection {
          contributionCalendar {
            totalContributions
            weeks {
              contributionDays {
                contributionCount
                date
              }
            }
          }
        }
      }
    }
    `;

    try {
        const response = await fetch('https://api.github.com/graphql', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${pat}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                query,
                variables: { userName },
            }),
            next: { revalidate: 86400 } // Cache revalidation every 24 hours (86400s)
        });

        const data = await response.json();
        
        if (!response.ok) {
            return NextResponse.json({ error: 'GitHub API error', details: data }, { status: response.status });
        }

        const calendar = data?.data?.user?.contributionsCollection?.contributionCalendar;
        if (!calendar) {
            return NextResponse.json({ error: 'No contribution data found for this user', raw: data }, { status: 404 });
        }

        return NextResponse.json(calendar);
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
