SoloStream
==========

A simple RTCPeerConnection application designed for remote desktop assistance with one sender and one receiver, providing a real-time video streaming experience similar to remote desktop sharing.

Deployment
----------

Access the deployed application here: [SoloStream Web](https://solo-stream-web.vercel.app/)

Tech Stack
----------

**Frontend**:

*   Next.js (v14.2.13)
*   React (v18)
*   Tailwind CSS (v3.4.1) for styling
*   Radix UI components for enhanced accessibility
*   TypeScript for type safety

**Backend/WebSocket**:

*   `ws` library for WebSocket communication

**Utilities**:

*   Tailwind CSS and associated plugins (`tailwind-merge`, `tailwindcss-animate`)
*   Class Variance Authority (CVA) for consistent styling
*   ESLint and Prettier for code quality and formatting
*   Turbo for optimized builds

Installation
------------

1.  Clone the repository:
    
    `git clone [https://github.com/ankurjaiswalofficial/SoloStream.git](https://github.com/ankurjaiswalofficial/SoloStream.git) cd SoloStream`
    
2.  Install dependencies:
    
    `npm install`
    
3.  Run the development server:
    
    `npm run dev`
    
    Open [http://localhost:3000/](http://localhost:3000/) to view it in your browser.
    

Features
--------

*   **Real-Time Communication**: Utilize RTCPeerConnection for live video and audio streaming between a sender and receiver.
*   **WebSocket Integration**: Establishes a secure and fast connection using the `ws` library.
*   **Responsive UI**: Built with Tailwind CSS for a responsive and accessible user interface.
*   **Dark Mode Support**: Integrated with `next-themes` for seamless theme switching.

Scripts
-------

*   `npm run dev`: Starts the development server.
*   `npm run build`: Builds the application for production.
*   `npm run start`: Starts the production server.
*   `npm run lint`: Runs ESLint for code quality checks.
*   `npm run format`: Formats the codebase using Prettier.

License
-------

This project is licensed under the MIT License.
