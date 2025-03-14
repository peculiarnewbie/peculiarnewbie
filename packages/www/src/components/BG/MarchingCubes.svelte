<script lang="ts" module>
    import { Color, Vector3 } from "three";

    // reusable for calculating world position of `MarchingCube`s
    const position = new Vector3();

    const defaultResolution = 50;
</script>

<script lang="ts">
    import type { Props } from "@threlte/core";
    import { MarchingCube } from "./MarchingCube";
    import { MarchingCubes } from "./MarchingCubes";
    import { MeshBasicMaterial } from "three";
    import { T, useTask } from "@threlte/core";

    type MarchingCubesProps = {
        resolution?: number;
        enableUvs?: boolean;
        enableColors?: boolean;
        isolation?: number;
        offset: { x: number; y: number; z: number };
        scalarMultiplier: number;
    } & Props<MarchingCubes>;

    let {
        resolution = defaultResolution,
        children,
        ref = $bindable(),
        ...props
    }: MarchingCubesProps = $props();

    const material = new MeshBasicMaterial();
    const marchingCubes = new MarchingCubes(
        defaultResolution,
        material,
        false,
        false,
        20_000
    );

    $effect(() => {
        //@ts-expect-error
        if (resolution !== marchingCubes.resolution) {
            marchingCubes.init(resolution);
        }
        marchingCubes;
    });

    useTask(() => {
        marchingCubes.reset();
        for (const child of marchingCubes.children) {
            switch (true) {
                case child instanceof MarchingCube:
                    child.getWorldPosition(position);
                    position.multiplyScalar(props.scalarMultiplier);

                    child.color = new Color()
                        //@ts-expect-error
                        .copy(child.originalColor)
                        .multiplyScalar(Math.pow(props.scalarMultiplier, 2));
                    position.addScalar(1).multiplyScalar(0.5); // center it
                    marchingCubes.addBall(
                        position.x,
                        position.y,
                        position.z,
                        child.strength - 0.3 * (props.scalarMultiplier - 1),
                        child.subtract,
                        child.color
                    );
                    break;
            }
        }
        marchingCubes.update(props.offset);
    });

    // cleanup default material if marchingCubes.material has been set to something else
    $effect(() => {
        return () => {
            if (marchingCubes.material !== material) {
                material.dispose();
            }
        };
    });
</script>

<T is={marchingCubes} bind:ref {...props}>
    {@render children?.({ ref: marchingCubes })}
</T>
