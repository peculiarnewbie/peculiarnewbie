<script lang="ts">
    import Scene from "./Scene.svelte";
    import { Canvas } from "@threlte/core";

    let ballCount = $state(15);
    let isolation = $state(80);
    let resolution = $state(35);
</script>

<div>
    <Canvas>
        <Scene {ballCount} {resolution} {isolation} />
    </Canvas>
</div>

<style>
    div {
        height: 100%;
    }
</style>
