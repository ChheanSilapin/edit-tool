# Video Editor Services Analysis

Based on the `package.json` dependencies and the source code (specifically `src/features/editor/timeline/items/video.ts`), here is the complete list of services and packages powering the video editor:

## 1. Animations and Transitions
To handle the smooth animations and transitions between clips, the project relies on three main libraries:
* **`@designcombo/animations` and `@designcombo/transitions`**: These are custom packages built specifically for the Designcombo timeline. They provide pre-built animations like fade, slide, and scale.
* **`framer-motion` & `motion`**: These are physics-based animation libraries for React. Designcombo uses them heavily under the hood to ensure everything feels perfectly smooth when sliding elements around.

## 2. Video Rendering
To play back the video in the browser and ultimately export it to an MP4 file, the project relies entirely on **Remotion**:
* **`@remotion/player`**: This powers the main video preview window (`Scene` component). It allows React components to be synchronized exactly to 30 or 60 Frames Per Second (FPS).
* **`@remotion/renderer`**: This is the engine that will run on the backend/server when the user clicks "Export". It takes the timeline JSON data and uses Google Chrome via Puppeteer to take thousands of screenshots of the React code, stitching them together into a final `.mp4`.

## 3. Video Sequence Thumbnails (Timeline Filmstrip)
Extracting hundreds of thumbnail images from a video file to display on the timeline is handled purely on the client side using the following tools:
* **`@designcombo/frames` (The `MP4Clip` class)**: This library is dynamically imported purely on the client side (`browser`) and reads the raw binary data of the `.mp4` file using the Web API. It parses the video chunks directly in the browser without needing a backend server.
* **Native HTML5 `<canvas>` and `OffscreenCanvas`**: Once the frames are parsed, the timeline uses the native browser Canvas API (`OffscreenCanvasRenderingContext2D`) to draw all individual thumbnails side-by-side in memory very rapidly so it doesn't freeze the webpage.
* **Custom `ThumbnailCache` Class**: The project includes a custom memory management system (`src/features/editor/utils/thumbnail-cache.ts`). Since drawing 500 images at once could crash the browser, this class stores the extracted images and limits the cache to a `maxCacheSize` of 500 frames so that memory doesn't leak while the user scrolls left and right.
