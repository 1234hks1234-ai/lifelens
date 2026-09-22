import type { Decision, Example } from '@/types'
import { uid } from '@/lib/id'

export const EXAMPLES: Example[] = [
  {
    slug: 'masters',
    category: 'Education',
    blurb: 'Weigh two years of full-time study against part-time learning, a short certificate, and staying put.',
    decision: {
      id: 'example-masters',
      title: "Should I go back to school for a master's degree?",
      description:
        "I'm a data analyst with five years of experience and I've hit a ceiling in my current role. A master's could open up machine learning work, but it's a big commitment of money and time, and I'm not sure it beats learning on the job.",
      options: [
        {
          id: 'masters-full',
          name: 'Full-time MSc in Data Science',
          description: 'Two years on campus with a research track. The strongest credential and network, but no salary while I study.',
          months: 24,
          cost: 62000,
          importance: 9,
        },
        {
          id: 'masters-part',
          name: "Part-time online master's",
          description: 'Keep my salary and study evenings and weekends over three years. Slower, but far less financial risk.',
          months: 36,
          cost: 24000,
          importance: 7,
        },
        {
          id: 'masters-cert',
          name: 'Certificate plus portfolio',
          description: 'A six-month machine learning certificate and two portfolio projects, aimed at an internal transfer.',
          months: 6,
          cost: 3200,
          importance: 5,
        },
        {
          id: 'masters-stay',
          name: 'Stay the course',
          description: 'Keep growing through mentoring and stretch projects at my current company.',
          months: 12,
          cost: 800,
          importance: 4,
        },
      ],
    },
  },
  {
    slug: 'relocation',
    category: 'Relocation',
    blurb: 'Compare moving abroad, moving across the country, buying a home, and staying where you are.',
    decision: {
      id: 'example-relocation',
      title: 'Where should we live for the next five years?',
      description:
        "We're both remote-capable and our lease ends in four months. We want more space and a lower cost of living without moving too far from our families.",
      options: [
        {
          id: 'move-lisbon',
          name: 'Move to Lisbon',
          description: 'Warm climate and a strong expat community. Higher upfront cost and a longer setup, with flights back to family.',
          months: 5,
          cost: 14500,
          importance: 7,
        },
        {
          id: 'move-denver',
          name: 'Move to Denver',
          description: 'Close to the mountains, with a direct flight from both our hometowns. Housing costs are similar to now.',
          months: 3,
          cost: 9200,
          importance: 6,
        },
        {
          id: 'buy-suburbs',
          name: 'Buy in the suburbs',
          description: 'Use our savings on a down payment and finally get real space. It locks us into one place and adds maintenance.',
          months: 8,
          cost: 42000,
          importance: 8,
        },
        {
          id: 'stay-renegotiate',
          name: 'Stay and renegotiate',
          description: 'Renew the lease at a lower rent and take a small studio nearby to use as an office.',
          months: 2,
          cost: 6500,
          importance: 4,
        },
      ],
    },
  },
  {
    slug: 'ceramics',
    category: 'Business',
    blurb: 'See how quitting outright stacks up against testing the market first.',
    decision: {
      id: 'example-ceramics',
      title: 'Should I turn my ceramics hobby into a business?',
      description:
        'I sell about ten pieces a month at local markets while working full time. Demand is growing, but going all in means giving up a steady paycheck.',
      options: [
        {
          id: 'ceramics-quit',
          name: 'Quit and launch full time',
          description: 'Rent a studio, hire a part-time assistant, and go all in within six months.',
          months: 6,
          cost: 22000,
          importance: 9,
        },
        {
          id: 'ceramics-popups',
          name: 'Test with weekend pop-ups',
          description: 'Keep the day job and run one weekend market and an online shop for nine months.',
          months: 9,
          cost: 2800,
          importance: 7,
        },
        {
          id: 'ceramics-wholesale',
          name: 'Wholesale to local cafés',
          description: 'Focus on repeat orders from five to ten cafés and restaurants for steadier income.',
          months: 12,
          cost: 7500,
          importance: 7,
        },
        {
          id: 'ceramics-hobby',
          name: 'Keep it a hobby',
          description: 'Sell occasionally and keep studio time relaxed.',
          months: 1,
          cost: 400,
          importance: 3,
        },
      ],
    },
  },
  {
    slug: 'car',
    category: 'Big purchase',
    blurb: 'Total cost, timeline, and peace of mind across buying, leasing, and repairing.',
    decision: {
      id: 'example-car',
      title: 'Which car should we buy next?',
      description:
        'Our ten-year-old car needs about $3,000 of repairs soon. We drive around 9,000 miles a year and want to keep total costs down without a surprise bill.',
      options: [
        {
          id: 'car-ev',
          name: 'New electric SUV',
          description: 'Lowest running costs and a full warranty. The highest price, and home charging needs an electrician.',
          months: 30,
          cost: 46000,
          importance: 7,
        },
        {
          id: 'car-hybrid',
          name: 'Certified used hybrid',
          description: 'Two years old with good fuel economy and a warranty. Mid-range cost and no install required.',
          months: 18,
          cost: 22500,
          importance: 8,
        },
        {
          id: 'car-lease',
          name: 'Lease a compact EV',
          description: 'A low monthly payment for three years with nothing to own at the end.',
          months: 36,
          cost: 10800,
          importance: 5,
        },
        {
          id: 'car-repair',
          name: 'Repair the current car',
          description: 'Fix it and drive it for another two years.',
          months: 24,
          cost: 3200,
          importance: 4,
        },
      ],
    },
  },
]

/** A fresh copy of an example, so editing it never touches the originals. */
export function instantiate(decision: Decision): Decision {
  return {
    ...decision,
    id: uid(),
    options: decision.options.map((option) => ({ ...option })),
  }
}

export function findExample(slug: string): Example {
  return EXAMPLES.find((e) => e.slug === slug) ?? EXAMPLES[0]
}
