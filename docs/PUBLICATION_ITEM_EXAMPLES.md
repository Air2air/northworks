# PublicationItem Component Usage Example

This document shows how to use the PublicationItem component in markdown files to create a visually appealing publications list.

## Before (Traditional Markdown)

```markdown
#### Understanding Risk: Informing Decisions in a Democratic Society
Paul C. Stern and Harvey V. Fineberg (Eds.)
National Academy Press, 1996

#### Science and Judgment in Risk Assessment
National Research Council
National Academy Press, 1994

#### Improving Risk Communication
National Research Council
National Academy Press, 1989
```

## After (With PublicationItem Component)

```jsx
<PublicationItem
  thumbnail="book-understanding.gif"
  alt="Understanding Risk book cover"
  title="Understanding Risk: Informing Decisions in a Democratic Society"
  authors="Paul C. Stern and Harvey V. Fineberg (Eds.)"
  details="National Academy Press, 1996"
  href="https://nap.nationalacademies.org/catalog/5138"
/>

<PublicationItem
  thumbnail="book-judgement.gif"
  alt="Science and Judgment book cover"
  title="Science and Judgment in Risk Assessment"
  authors="National Research Council"
  details="National Academy Press, 1994"
  href="https://nap.nationalacademies.org/catalog/2125"
/>

<PublicationItem
  thumbnail="book-communication.gif"
  alt="Improving Risk Communication book cover"
  title="Improving Risk Communication"
  authors="National Research Council"
  details="National Academy Press, 1989"
  href="https://nap.nationalacademies.org/catalog/1189"
/>
```

## Visual Result

Each publication now displays as:

```
┌─────────────┬──────────────────────────────────────────────────────┐
│             │ Understanding Risk: Informing Decisions in a         │
│  [Thumbnail]│ Democratic Society                                   │
│             │ Paul C. Stern and Harvey V. Fineberg (Eds.)          │
│   120x160   │ National Academy Press, 1996                         │
└─────────────┴──────────────────────────────────────────────────────┘
```

With:
- Thumbnail image on the left (120x160px by default)
- Title in bold on the right
- Authors below the title
- Publication details below authors
- Entire block clickable if href is provided
- Hover effect (background changes to light gray)
- Responsive layout for mobile devices

## Example: Full Publications Page Section

```markdown
---
id: w-publications
title: Publications & Research Papers
type: publication
useFigures: true
description: Selected publications by D. Warner North
---

## National Research Council Reports

Dr. North has been a co-author on many influential National Research Council reports dealing with environmental risk assessment and decision making.

<PublicationItem
  thumbnail="book-understanding.gif"
  alt="Understanding Risk book cover"
  title="Understanding Risk: Informing Decisions in a Democratic Society"
  authors="Paul C. Stern and Harvey V. Fineberg (Eds.)"
  details="National Academy Press, 1996. ISBN: 978-0-309-05396-8"
  href="https://nap.nationalacademies.org/catalog/5138"
/>

This landmark report presents a framework for improving risk communication and public participation in environmental decision making.

<PublicationItem
  thumbnail="book-judgement.gif"
  alt="Science and Judgment book cover"
  title="Science and Judgment in Risk Assessment"
  authors="National Research Council Committee on Risk Assessment of Hazardous Air Pollutants"
  details="National Academy Press, 1994. ISBN: 978-0-309-04894-0"
  href="https://nap.nationalacademies.org/catalog/2125"
/>

This report examines the scientific basis for risk assessment and provides recommendations for improving the process.

## Decision Analysis Publications

<PublicationItem
  thumbnail="book-human.jpg"
  alt="Human-System Risk Management book cover"
  title="Human-System Risk Management: Foundations and Practice"
  authors="D. Warner North and others"
  details="IEEE Computer Society Press, 2021"
  width={120}
  height={180}
/>

## Earlier Works

For publications without cover images, continue using traditional markdown:

#### The Decision to Seed Hurricanes
(with R.A. Howard and J.E. Matheson)
**Science**, Vol. 176, p. 1191-1202, 1972.
```

## Tips for Best Results

1. **Use consistent dimensions**: Stick with default 120x160 or choose custom dimensions and apply consistently
2. **Provide good alt text**: Describe what's on the cover for accessibility
3. **Include full citation in details**: Publisher, year, ISBN when available
4. **Link to authoritative sources**: National Academies Press, journal websites, DOIs
5. **Mix with regular markdown**: Use PublicationItem for books/major reports, regular markdown for papers
6. **Group by category**: Use markdown headings to organize publications by type or topic

## Mobile Responsiveness

On smaller screens, the layout automatically adjusts:
- Thumbnail remains on left but may scale down
- Text wraps appropriately
- Touch targets are adequately sized
- Gaps adjust for comfortable reading

## Accessibility Considerations

✅ All images require alt text
✅ Semantic HTML structure
✅ Keyboard navigable links
✅ Sufficient color contrast
✅ Screen reader friendly
✅ Focus indicators on interactive elements
