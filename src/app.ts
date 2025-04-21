
// import "@babylonjs/core/Debug/debugLayer.js";
// import "@babylonjs/inspector";

import { FreeCamera } from "@babylonjs/core/Cameras/freeCamera.js";
import { HemisphericLight } from "@babylonjs/core/Lights/hemisphericLight.js";
import { Vector3 } from "@babylonjs/core/Maths/math.vector.js";
import {CreateBox} from "@babylonjs/core/Meshes/Builders/boxBuilder.js";
import { CreateGround } from "@babylonjs/core/Meshes/Builders/groundBuilder.js";
import { CreateSphere } from "@babylonjs/core/Meshes/Builders/sphereBuilder.js";
import { Scene } from "@babylonjs/core/scene.js";
import { GridMaterial } from "@babylonjs/materials/grid/gridMaterial.js";
import HavokPhysics from "@babylonjs/havok";

import {Color3, HavokPlugin, PhysicsAggregate, PhysicsShapeType, UniversalCamera, WebGPUEngine} from "@babylonjs/core";
import {SimpleMaterial} from "@babylonjs/materials";


async function main() {

    const canvas = document.getElementById("renderCanvas") as HTMLCanvasElement;


    const engine = new WebGPUEngine(canvas);
    await engine.initAsync();




    const scene = new Scene(engine);

    const havokInstance = await HavokPhysics({});
    const havokPlugin = new HavokPlugin(true, havokInstance);

    scene.enablePhysics(new Vector3(0, -9.8, 0), havokPlugin);



    const camera = new UniversalCamera("camera1", new Vector3(0, 50, -100), scene);



    camera.setTarget(Vector3.Zero());


    camera.attachControl(canvas, true);



    const light = new HemisphericLight("light1", new Vector3(0, 1, 0), scene);
    light.intensity = 1;



    const material = new GridMaterial("grid", scene);
    material.majorUnitFrequency = 5;
    material.mainColor = Color3.Gray()

    const simpleMaterial = new SimpleMaterial("simple", scene)
    simpleMaterial.diffuseColor = new Color3(1,0,0);


    const sphere = CreateSphere('sphere1', { segments: 16, diameter: 2 }, scene);
    sphere.position.y = 50;
    const sphereAggregate = new PhysicsAggregate(sphere, PhysicsShapeType.SPHERE, { mass: 1, restitution: 0.75 }, scene);


    sphere.material = simpleMaterial;


    const ground = CreateGround('ground1', { width: 2000, height: 2000, subdivisions: 2 }, scene);
    const groundAggregate = new PhysicsAggregate(ground, PhysicsShapeType.BOX, { mass: 0 }, scene);

    ground.material = material;


    engine.runRenderLoop(() => {
        scene.render();
    });


    //scene.debugLayer.show();

    setInterval(() => {
        if (Math.random() > 0.5) {
            const sphere = CreateSphere(undefined, {segments: 16, diameter: 2}, scene);
            sphere.position.x = Math.random() * 10;
            sphere.position.z = Math.random() * 10;
            sphere.position.y = 50 + Math.random() * 10;

            const randomMaterial = new SimpleMaterial("simple", scene);
            randomMaterial.diffuseColor = new Color3(Math.random(), Math.random(), Math.random());
            sphere.material = randomMaterial;

            const sphereAggregate = new PhysicsAggregate(sphere, PhysicsShapeType.SPHERE, {
                mass: 1,
                restitution: 0.75
            }, scene);
        } else {
            const box = CreateBox(undefined, {size: 2 + Math.random() * 2}, scene);
            box.position.x = Math.random() * 10;
            box.position.z = Math.random() * 10;
            box.position.y = 50 + Math.random() * 10;
            box.rotation.y = Math.random() * Math.PI;

            const randomMaterial = new SimpleMaterial("simple", scene);
            randomMaterial.diffuseColor = new Color3(Math.random(), Math.random(), Math.random());
            box.material = randomMaterial;

            const boxAggregate = new PhysicsAggregate(box, PhysicsShapeType.BOX, {mass: 1, restitution: 0.75}, scene);
        }
    }, 16)
}


main().then(() => {
    console.log("done");
})
