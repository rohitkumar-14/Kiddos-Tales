import adventurousCover from "../assets/Adventurous.webp";
import bunnyCover from "../assets/bedstory.webp";
import storyScene1 from "../assets/Magical.webp";
import storyScene2 from "../assets/story.webp";
import storyScene3 from "../assets/hero.webp";

export const demoStories = [
  {
    title: "The Magical Treehouse",
    subject: "adventure",
    storyType: "fantasy",
    ageGroup: "7-9",
    storyTone: "exciting",
    storyTheme: "friendship and discovery",
    language: "English",
    imageUrl: adventurousCover,
    coverImage: adventurousCover,
    text: `Once upon a time, in a small village, there was a magical treehouse. It appeared only at night. One day, two curious kids, Mia and Leo, climbed into it.

Inside the treehouse, they found glowing books and maps that pointed to hidden lands. As the moonlight touched the treehouse, it soared into the sky!

They visited cloud kingdoms, danced with starfish in the sky, and learned about courage and kindness from talking animals.

In the end, the treehouse brought them back safely before sunrise. Mia and Leo promised to keep its magic a secret and visit again soon.`,
    englishText: `Once upon a time, in a small village, there was a magical treehouse. It appeared only at night. One day, two curious kids, Mia and Leo, climbed into it.

Inside the treehouse, they found glowing books and maps that pointed to hidden lands. As the moonlight touched the treehouse, it soared into the sky!

They visited cloud kingdoms, danced with starfish in the sky, and learned about courage and kindness from talking animals.

In the end, the treehouse brought them back safely before sunrise. Mia and Leo promised to keep its magic a secret and visit again soon.`,
    pageImages: [storyScene1, storyScene2, storyScene3],
    quiz: [
      {
        question: "When did the magical treehouse appear?",
        options: ["Only at night", "At lunchtime", "During rainstorms", "On Sundays"],
        answer: "Only at night",
      },
    ],
  },
  {
    title: "Benny the Brave Bunny",
    subject: "bunny",
    storyType: "animal tale",
    ageGroup: "4-6",
    storyTone: "fun and uplifting",
    storyTheme: "courage",
    language: "English",
    imageUrl: bunnyCover,
    coverImage: bunnyCover,
    text: `Benny was a tiny bunny who feared everything – wind, rain, and even butterflies! One morning, a storm blew his favorite carrot toy away.

With shaky paws, Benny followed it across the field, into the forest, and across a stream. He faced bugs, wind, and a grumpy bird!

In the end, Benny found his toy – and realized he wasn’t scared anymore. He had faced it all, and he felt proud.

From that day, Benny became the bravest bunny in the burrow!`,
    englishText: `Benny was a tiny bunny who feared everything – wind, rain, and even butterflies! One morning, a storm blew his favorite carrot toy away.

With shaky paws, Benny followed it across the field, into the forest, and across a stream. He faced bugs, wind, and a grumpy bird!

In the end, Benny found his toy – and realized he wasn’t scared anymore. He had faced it all, and he felt proud.

From that day, Benny became the bravest bunny in the burrow!`,
    pageImages: [bunnyCover, storyScene2, storyScene1],
    quiz: [
      {
        question: "What did the storm blow away from Benny?",
        options: ["His carrot toy", "His green hat", "His warm blanket", "A shiny coin"],
        answer: "His carrot toy",
      },
    ],
  },
];
