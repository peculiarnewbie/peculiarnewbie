<script lang="ts">
    import MarchingCubes from "./MarchingCubes.svelte";
    import {
        AmbientLight,
        Color,
        MeshBasicMaterial,
        OrthographicCamera,
        PerspectiveCamera,
    } from "three";
    import { MarchingCube } from "./MarchingCube";
    import { T, useTask } from "@threlte/core";
    import { interactivity, useViewport } from "@threlte/extras";
    import { onMount } from "svelte";
    import { Spring } from "svelte/motion";

    type SceneProps = {
        ballCount?: number;
        isolation?: number;
        resolution: number;
    };
    let {
        ballCount = 5,
        isolation = 80,
        resolution = 50,
    }: SceneProps = $props();

    // let mousePos = $state({ x: 0, y: 0 });
    let lightPos = new Spring(
        { x: 0, y: 0 },
        { stiffness: 0.08, damping: 0.7 }
    );
    let cursorPos = new Spring(
        { x: 0, y: 0 },
        { stiffness: 0.15, damping: 0.6 }
    );
    let scalarMultiplier = new Spring(1, { stiffness: 0.15, damping: 0.6 });
    interactivity();
    let viewport = useViewport();

    const randomColor = (): Color => {
        return new Color()
            .setRGB(0.1, 0.05, 0.2 + Math.random() * 0.2)
            .multiplyScalar(0.5);
    };

    /**
     * creates `count` randomly colored balls that are evenly distributed around a unit circle scaled by `scale`
     */
    const createBalls = (count: number, scale = 0.35): MarchingCube[] => {
        const balls: MarchingCube[] = [];
        const m = (2 * Math.PI) / count;
        for (let i = 0; i < count; i += 1) {
            const ball = new MarchingCube(randomColor()) as MarchingCube & {
                originalColor: Color;
            };
            ball.originalColor = new Color().copy(ball.color);
            const r = m * i;
            const x = Math.cos(r);
            const y = Math.sin(r);
            ball.position.set(x, 0, y).multiplyScalar(scale);
            balls.push(ball);
        }
        return balls;
    };

    const balls = $derived(createBalls(ballCount));

    let time = 0;
    useTask((delta) => {
        time += delta * 2;
        let i = 0;
        for (const ball of balls) {
            ball.position.setY(0.2 * Math.sin(time + i) - 0.5);
            // ball.position.setX(0.1 * Math.random() - 0.5);
            // ball.position.setZ(0.5 * Math.sin(time + i) - 0.5);
            i += 1;
        }
    });

    onMount(() => {
        document.addEventListener("pointermove", (e) => {
            const width = window.visualViewport
                ? window.visualViewport.width
                : window.innerWidth;
            const height = window.visualViewport
                ? window.visualViewport.height
                : window.innerHeight;
            const x = e.clientX / width;
            const y = e.clientY / height;
            const xPos = (x - 0.5) * viewport.current.width;
            const yPos = (y - 0.5) * viewport.current.height;
            lightPos.set({ x: xPos, y: yPos });
            cursorPos.set({ x: xPos, y: yPos });
        });

        document.addEventListener("link-hover", (e) => {
            scalarMultiplier.set(2);
        });

        document.addEventListener("link-hover-end", (e) => {
            scalarMultiplier.set(1);
        });
    });
</script>

<T.OrthographicCamera
    makeDefault
    near={0.01}
    position={[0, 2, 0]}
    zoom={50}
    rotation={[-Math.PI / 2, 0, 0]}
></T.OrthographicCamera>

<T.PointLight
    intensity={0.35 * Math.pow(scalarMultiplier.current, 0.5)}
    decay={1.5}
    color={[0.4, 0.4, 1]}
    position={[lightPos.current.x, 2, lightPos.current.y]}
/>

<T.AmbientLight
    intensity={0.03}
    color={[0.4, 0.4, 1]}
    position={[lightPos.current.x, 1.5, lightPos.current.y]}
/>

<MarchingCubes
    enableColors
    {resolution}
    {isolation}
    offset={{ x: cursorPos.current.x, y: 0, z: cursorPos.current.y }}
    scalarMultiplier={scalarMultiplier.current}
    position={[0, 0.4, 0]}
>
    <T.MeshBasicMaterial vertexColors={true} color="white" />
    {#each balls as ball}
        <T is={ball} />
    {/each}
</MarchingCubes>

<T.Mesh position={[0, -1, 0]} rotation.x={-Math.PI / 2}>
    <T.CircleGeometry args={[40, 40]} />
    <T.MeshStandardMaterial color="white" />
</T.Mesh>
