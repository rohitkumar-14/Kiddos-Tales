import { useState } from "react";
import HTMLFlipBook from "react-pageflip";

// Helper function to split text into pages
function paginateText(text, wordLimit = 40) {
  const words = text.split(" ");
  let pages = [];
  let pageText = [];

  words.forEach((word) => {
    pageText.push(word);
    if (pageText.length >= wordLimit && word.includes(".")) {
      pages.push(pageText.join(" "));
      pageText = [];
    }
  });

  if (pageText.length > 0) {
    pages.push(pageText.join(" "));
  }

  return pages;
}

function GeneratedBooks({ generatedStories }) {
  const [coverOnly, setCoverOnly] = useState(
    generatedStories.map(() => true) 
  );

  const handleFlip = (index, e) => {
    if (e.data === 1) {
      setCoverOnly((prevState) => {
        const newCoverOnly = [...prevState];
        newCoverOnly[index] = false;
        return newCoverOnly;
      });
    }
  };

  return (
    <div className="flex flex-wrap justify-center items-center gap-8 min-h-screen bg-gray-100 p-4">
      {generatedStories.length > 0 ? (
        generatedStories.map((story, index) => (
         <HTMLFlipBook
  key={index}
  width={400}
  height={300}
  className="shadow-lg rounded-lg overflow-hidden"
  onFlip={(e) => handleFlip(index, e)}
>
  {/* Book Cover */}
  <div className="flex flex-col justify-center items-center bg-teal-500 text-white h-full p-8 text-center">
    <h1 className="text-3xl font-bold mb-4">Story Book</h1>
    <h2 className="text-2xl capitalize">{story.title}</h2>
    <h2 className="text-lg capitalize">Subject: {story.subject}</h2>
    <p className="text-lg capitalize">Type: {story.storyType}</p>
    <p className="text-lg">Age Group: {story.ageGroup}</p>
    <p className="mt-4 text-base text-center">Now Start Reading :)</p>
  </div>

  {coverOnly[index] ? (
    <div className="flex items-center justify-center bg-white text-gray-500 h-full">
      <p className="text-center py-7">Just reload the page once</p>
    </div>
  ) : (
    paginateText(story.text).map((pageContent, pageIndex) => (
      <div key={pageIndex} className="bg-white p-6 h-full">
        <h2 className="text-2xl font-semibold capitalize">{story.title}</h2>
        <p className="text-sm text-gray-500 mb-4 capitalize">
          {story.storyType} - Age Group: {story.ageGroup}
        </p>
        <p className="text-base leading-relaxed">{pageContent}</p>
      </div>
    ))
  )}
</HTMLFlipBook>

        ))
      ) : (
        <div>No stories available.</div>
      )}
    </div>
  );
}

export default GeneratedBooks;
