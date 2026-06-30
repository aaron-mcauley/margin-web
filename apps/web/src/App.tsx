import { useState } from "react";
import { Stage, Layer, Line } from "react-konva";
import "./App.scss";

type Tool = "pen" | "eraser";

type Stroke = {
  id: string;
  points: number[];
};

function App() {
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
        </div>
      </nav>
      
      {aiAnswer && <div className="aiResponse">{aiAnswer}</div>}
      <main className="workspace">
        <section className="notePage">
          <div className="paperLines"></div>

          <Stage
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
