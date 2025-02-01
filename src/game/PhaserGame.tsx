import {
  forwardRef,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import StartGame from "./main";
import { EventBus } from "./EventBus";
import { Game } from "./scenes/Game";
import { FarmPlot } from "./objects/FarmPlot";

export interface IRefPhaserGame {
  game: Phaser.Game | null;
  scene: Phaser.Scene | null;
}

interface IProps {
  currentActiveScene?: (scene_instance: Phaser.Scene) => void;
}

export const PhaserGame = forwardRef<IRefPhaserGame, IProps>(
  function PhaserGame({ currentActiveScene }, ref) {
    const game = useRef<Phaser.Game | null>(null!);

    const [uiValues, setUiValues] = useState({
      wheatSeeds: 0,
      tomatoSeeds: 0,
      riceSeeds: 0,
      riceSupply: 0,
    });

    useLayoutEffect(() => {
      if (game.current === null) {
        game.current = StartGame("game-container");

        if (typeof ref === "function") {
          ref({ game: game.current, scene: null });
        } else if (ref) {
          ref.current = { game: game.current, scene: null };
        }
      }

      return () => {
        if (game.current) {
          game.current.destroy(true);
          if (game.current !== null) {
            game.current = null;
          }
        }
      };
    }, [ref]);

    useEffect(() => {
      EventBus.on("current-scene-ready", (scene_instance: Phaser.Scene) => {
        if (currentActiveScene && typeof currentActiveScene === "function") {
          currentActiveScene(scene_instance);
        }

        if (typeof ref === "function") {
          ref({ game: game.current, scene: scene_instance });
        } else if (ref) {
          ref.current = { game: game.current, scene: scene_instance };
        }
      });
      return () => {
        EventBus.removeListener("current-scene-ready");
      };
    }, [currentActiveScene, ref]);

    // Listen for seed-picked event
    useEffect(() => {
      EventBus.on("seed-picked", (scene: Game) => {
        setUiValues({
          wheatSeeds: scene.seedCount.wheat,
          tomatoSeeds: scene.seedCount.tomato,
          riceSeeds: scene.seedCount.rice,
          riceSupply: scene.riceSupply,
        });
      });
      return () => {
        EventBus.removeListener("seed-picked");
      };
    }, [ref]);

    return (
      <div style={{ width: "100%", maxWidth: 800 }}>
        <div id="game-container" />
        <div style={{ display: "flex" }}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              background: "#555",
              color: "white",
              padding: 16,
              width: "100%",
            }}
          >
            <div>Wheat Seeds: {uiValues.wheatSeeds}</div>
            <div>Tomato Seeds: {uiValues.tomatoSeeds}</div>
            <div>Rice Seeds: {uiValues.riceSeeds}</div>
            <div>Rice Supply: {uiValues.riceSupply}</div>
          </div>
        </div>
      </div>
    );
  }
);
