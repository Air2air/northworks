# Northworks

A comprehensive website for classical music reviews and risk analysis consultancy, built with Next.js and TypeScript.

## About

Northworks combines two distinct areas of expertise:

### Classical Music Reviews
- Extensive collection of interviews with renowned classical musicians
- Performance reviews from major venues and opera houses
- Coverage of San Francisco Symphony, San Francisco Opera, and other Bay Area performances
- Articles and features on classical music personalities and events

### Risk Analysis Consultancy
- Led by Dr. D. Warner North, expert in decision analysis and risk assessment
- Government consulting projects including EPA, DOE, NRC, and NASA
- Stanford University research and academic affiliations
- Laser technology applications in nuclear safety

## Technology Stack

- **Framework**: Next.js 15
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Content**: Static content in Markdown and HTML formats

## Project Structure

"`
public/
├── content/   # All articles, reviews, and interviews
├── images/   # Photos and graphics
├── pdf/    # Publication documents
└── pictures/  # Additional imagery

src/
├── app/    # Next.js app directory
└── components/  # React components
"`

## Getting Started

First, run the development server:

"`bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
"`

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Content Organization

### Classical Music Content
- `c *.md` - Interviews and articles about classical musicians
- `c reviews*.md` - Performance and concert reviews
- `c art *.md` - Special feature articles

### Risk Analysis Content 
- `w *.md` - Warner North's professional work and publications
- `w projects *.md` - Government and academic projects
- `w pub *.md` - Publications and research papers

## Features

- ✅ **Fixed HTML Tags**: All HTML content has been standardized with lowercase tags and proper closing
- 📱 **Responsive Design**: Modern web standards with Tailwind CSS
- 🎵 **Rich Media**: Extensive photo galleries and document archives
- 🔍 **Content Management**: Well-organized content structure for easy maintenance

## Recent Updates

- **August 2025**: Complete HTML tag standardization across all content files
- **Content Migration**: Preserved all original interviews, reviews, and technical documents
- **Modern Framework**: Migrated to Next.js 15 with TypeScript support

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm medium=default-template&filter=next.js&utm source=create-next-app&utm campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

---

*This project represents decades of classical music journalism and risk analysis expertise, now presented in a modern web framework.*
