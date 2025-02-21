<script lang="ts">
    import { onMount, type Component } from "svelte";
    import Scene from "./Scene.svelte";
    import { Canvas } from "@threlte/core";

    let ballCount = $state(10);
    let isolation = $state(80);
    let resolution = $state(35);
</script>

<Canvas>
    <Scene {ballCount} {resolution} {isolation} />
</Canvas>
