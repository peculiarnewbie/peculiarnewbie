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
    import { PI } from "three/tsl";
    import MarchingPlane from "./MarchingPlane.svelte";

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

    const randomColor = (): Color => {
        return new Color().setRGB(0.1, 0.05, 0.2 + Math.random() * 0.2);
    };

    /**
     * creates `count` randomly colored balls that are evenly distributed around a unit circle scaled by `scale`
     */
    const createBalls = (count: number, scale = 0.5): MarchingCube[] => {
        const balls: MarchingCube[] = [];
        const m = (2 * Math.PI) / count;
        for (let i = 0; i < count; i += 1) {
            const ball = new MarchingCube(randomColor());
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
            if (i == 2) ball.position.setX(-0.7);
            i += 1;
        }
    });
</script>

<T.PerspectiveCamera
    makeDefault
    near={0.01}
    position={[0, 8, 3]}
    rotation={[-Math.PI / 2.4, 0, 0]}
></T.PerspectiveCamera>

<T.PointLight
    intensity={3}
    decay={3}
    color={[0.4, 0.4, 1]}
    position={[0, 1.5, 0]}
/>
<!-- <T.AmbientLight intensity={2} color={[0.1, 0.1, 0.4]} /> -->

<T.Mesh position={[3, -1, 0]} rotation.x={-Math.PI / 2}>
    <T.BoxGeometry />
    <T.MeshBasicMaterial />
</T.Mesh>

<MarchingCubes enableColors {resolution} {isolation} position={[0, 0.4, 0]}>
    <T.MeshBasicMaterial vertexColors={true} color="white" />
    {#each balls as ball}
        <T is={ball} />
    {/each}
</MarchingCubes>

<T.Mesh position={[0, -1, 0]} rotation.x={-Math.PI / 2}>
    <T.CircleGeometry args={[40, 40]} />
    <T.MeshStandardMaterial color="white" />
</T.Mesh>
