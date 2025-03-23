import React from 'react'

const footer = () => {
  return (
    <footer className="bg-gray-900 text-white text-center py-4 mt-10 shadow-lg">
      <p className="text-sm">
        &copy; 2025 <span className="font-semibold">MovieRamp</span> - A Movie Finder. All Rights Reserved.
      </p>

      <p className="text-xs mt-1 opacity-80">
            Directed by{" "}
            <a
                href="https://github.com/yourgithub"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300 transition-colors duration-300"
            >
                Suriya Lakshmi M
            </a> 🎬 (Inspired by JSM YouTube)
       </p>
    </footer>
  )
}

export default footer