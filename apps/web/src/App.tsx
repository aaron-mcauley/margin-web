import { useRef, useState } from "react";
import { Stage, Layer, Line } from "react-konva";
import type Konva from "konva";
import "./App.scss";

type Tool = "pen" | "eraser";

type Stroke = {
  id: string;
  points: number[];
};

function App() {
  const stageRef = useRef<Konva.Stage>(null);
  const [tool, setTool] = useState<Tool>("pen");
  const [strokes, setStrokes] = useState<Stroke[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [aiAnswer, setAiAnswer] = useState("");

const testBackendAI = async () => {
  try {
    console.log("testBackendAI running");
    setAiAnswer("Loading...");

    const payload = { prompt: "who is winning the france sweden match going on right now?" };

    console.log("Payload:", payload);
    const response = await fetch("http://localhost:3001/api/ai/ask", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    console.log(data);

    setAiAnswer(data.answer ?? data.error ?? "No response text");
  } catch (error) {
    console.error(error);
    setAiAnswer(error instanceof Error ? error.message : "Request failed");
  }
};

const testCanvasOCR = async () => {
  try {
    console.log("1. Started");
    setAiAnswer("Reading Canvas...");

    const imageBase64 = stageRef.current?.toDataURL({
      mimeType: "image/png",
      pixelRatio: 2,
    });

    console.log("2. Captured image");

    if (!imageBase64) {
      setAiAnswer("Could not capture canvas.");
      return;
    }

    console.log("3. Image length:", imageBase64.length);

    const payload = {
      prompt: "Read the handwritten question in this image and give the answer",
      imageBase64,
    };

    console.log("4. Payload ready");

    const response = await fetch("http://localhost:3001/api/ai/ask", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    console.log("5. Fetch returned");

    const data = await response.json();

    console.log("6. JSON parsed", data);

    setAiAnswer(data.answer ?? data.error ?? "No response");
  } catch (err) {
    console.error(err);
  }
};

  const startDrawing = (e: any) => {
  e.evt.preventDefault();

  if (tool !== "pen") return;

  const stage = e.target.getStage();
  const point = stage?.getPointerPosition();

  if (!point) return;

  setIsDrawing(true);

  setStrokes((prev) => [
    ...prev,
    {
      id: `${Date.now()}-${Math.random()}`,
      points: [point.x, point.y],
    },
  ]);
};

  const draw = (e: any) => {
    e.evt.preventDefault();
    const stage = e.target.getStage();
    const point = stage.getPointerPosition();

    if (!point) return;

    if (tool === "eraser") {
      setStrokes((prev) =>
        prev.filter((stroke) => {
          for (let i = 0; i < stroke.points.length; i += 2) {
            const x = stroke.points[i];
            const y = stroke.points[i + 1];
            const distance = Math.hypot(point.x - x, point.y - y);

            if (distance < 18) {
              return false;
            }
          }

          return true;
        })
      );

      return;
    }

    if (!isDrawing) return;

    setStrokes((prev) => {
      const next = [...prev];
      const lastStroke = next[next.length - 1];

      lastStroke.points = lastStroke.points.concat([point.x, point.y]);

      return next;
    });
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  return (
    <div className="app">
      <nav className="navbar">
        <div className="brand">Margin</div>

        <div className="toolbar">
          <button
            className={`toolButton ${tool === "pen" ? "active" : ""}`}
            onClick={() => setTool("pen")}
          >
            ✏️
          </button>

          <button
            className={`toolButton ${tool === "eraser" ? "active" : ""}`}
            onClick={() => setTool("eraser")}
          >
            🧽
          </button>
          <button
            className="toolButton"
            onClick={() => {
              console.log("AI clicked");
              setAiAnswer("AI button clicked");
              testBackendAI();
  }}
>
  AI
</button>

        <button className="toolButton" onClick={testCanvasOCR}>OCR</button>
        </div>
      </nav>
      
      {aiAnswer && <div className="aiResponse">{aiAnswer}</div>}
      <main className="workspace">
        <section className="notePage">
          <div className="paperLines"></div>

          <Stage
          ref={stageRef}
            className="canvasLayer"
            width={794}
            height={1123}
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onTouchStart={startDrawing}
            onTouchMove={draw}
            onTouchEnd={stopDrawing}
          >
            <Layer>
              {strokes.map((stroke) => (
                <Line
                  key={stroke.id}
                  points={stroke.points}
                  stroke="#111"
                  strokeWidth={4}
                  tension={0.5}
                  lineCap="round"
                  lineJoin="round"
                />
              ))}
            </Layer>
          </Stage>
        </section>
      </main>
    </div>
  );
}

export default App;
