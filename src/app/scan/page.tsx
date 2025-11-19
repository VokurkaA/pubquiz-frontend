/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useRef } from "react";
import { useI18n } from "@/components/i18n/LanguageProvider";

export default function Scan() {
  const { t } = useI18n();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  // @no-explicit-any
  const detectorRef = useRef<any>(null);

  useEffect(() => {
    let streaming = true;
    let animationFrameId: number;

    const loadScripts = () =>
      new Promise<void>((resolve) => {
        const cvScript = document.createElement("script");
        cvScript.src = "/libs/cv.js";
        cvScript.async = true;
        cvScript.onload = () => {
          const arucoScript = document.createElement("script");
          arucoScript.src = "/libs/aruco.js";
          arucoScript.async = true;
          arucoScript.onload = () => {
            console.info("CV and js-aruco2 loaded");
            resolve();
          };
          document.body.appendChild(arucoScript);
        };
        document.body.appendChild(cvScript);
      });

    const startCamera = async () => {
      if (!videoRef.current) return;
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        videoRef.current.srcObject = stream;

        await new Promise<void>((resolve) => {
          videoRef.current?.addEventListener("loadedmetadata", () => resolve(), { once: true });
        });

        videoRef.current.play();

        // Only create the detector once
        // @ts-expect-error AR detector
        detectorRef.current = new AR.Detector({ dictionaryName: "ARUCO" });

        animationFrameId = requestAnimationFrame(processFrame);
      } catch (err) {
        console.error("Camera access error:", err);
      }
    };

    const processFrame = () => {
      if (!streaming || !videoRef.current || !canvasRef.current || !detectorRef.current) return;

      const video = videoRef.current;
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      // Resize canvas only once when video metadata is available
      if (canvas.width !== video.videoWidth || canvas.height !== video.videoHeight) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
      }

      if (video.videoWidth === 0 || video.videoHeight === 0) {
        animationFrameId = requestAnimationFrame(processFrame);
        return;
      }

      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      try {
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const markers = detectorRef.current.detect(imageData);

        ctx.lineWidth = 3;

        const allowedIds = [992, 960, 800, 36] //

        const answers = ['-', '-', '-', '-']

        markers.forEach((marker: any) => {

          if (true || allowedIds.includes(marker.id)) {

            const rotation = getMarkerRotation(marker) / 90 + 2;
            const answer = ['A', 'B', 'C', 'D', 'A', 'B', 'C', 'D', 'A', 'B', 'C', 'D'][Math.round(rotation)];
            answers[allowedIds.indexOf(marker.id)] = answer;

            const corners = marker.corners;

            // Draw corners
            ctx.strokeStyle = "red";
            ctx.beginPath();
            for (let i = 0; i < corners.length; i++) {
              const c = corners[i];
              ctx.moveTo(c.x, c.y);
              const next = corners[(i + 1) % corners.length];
              ctx.lineTo(next.x, next.y);
            }
            ctx.stroke();
            ctx.closePath();

            // Draw marker ID
            const x = Math.min(...corners.map((c: any) => c.x));
            const y = Math.min(...corners.map((c: any) => c.y));
            ctx.fillStyle = "blue";
            ctx.font = "50px Arial";
            ctx.fillText(answer + " -> " + marker.id.toString(), x, y);
          }
        });

        console.info(answers);
      } catch (err) {
        console.warn("Detection error:", err);
      }

      animationFrameId = requestAnimationFrame(processFrame);
    };

    loadScripts().then(() => startCamera());

    return () => {
      streaming = false;
      cancelAnimationFrame(animationFrameId);
      if (videoRef.current?.srcObject) {
        (videoRef.current.srcObject as MediaStream).getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  return (
    <div className="mx-auto w-full max-w-4xl p-4">
      <h1 className="mb-2 text-2xl font-semibold">{t("pages.scan.title")}</h1>
      <p className="text-muted-foreground">{t("pages.scan.subtitle")}</p>

      <div className="relative mt-4">
        <video ref={videoRef} style={{ display: "none" }} />
        <canvas ref={canvasRef} className="border w-full rounded-lg" />
      </div>
    </div>
  );
}

function getMarkerRotation(marker: any) {
  const c = marker.corners;

  // Take top-left and top-right corners
  const dx = c[1].x - c[0].x;
  const dy = c[1].y - c[0].y;

  // Angle in radians
  const angleRad = Math.atan2(dy, dx);

  // Convert to degrees
  const angleDeg = angleRad * (180 / Math.PI);

  return angleDeg;
}