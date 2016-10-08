/// <reference path="../Object3d.ts"/>
/// <reference path="../materials/Material.ts"/>
/// <reference path="../geometries/Geometry.ts"/>
/// <reference path="../Mesh.ts"/>

namespace CanvasToy {

    export class OBJLoader {

        static commentPattern = /\#.*/mg;
        static numberPattern = /([0-9]|\.|\-|e)+/g;
        static faceSplitVertPattern = /([0-9]|\/|\-)+/g;
        static facePerVertPattern = /([0-9]*)\/?([0-9]*)\/?([0-9]*)/
        static objectSplitPattern = /[o|g]\s+.+/mg;
        static materialPattern = /usemtl\s.+/;
        static vertexPattern = /v\s+([0-9]|\s|\.|\-|e)+/mg;
        static uvPattern = /vt\s+([0-9]|\s|\.|\-|e)+/mg;
        static normalPattern = /vn\s+([0-9]|\s|\.|\-|e)+/mg;
        static indexPattern = /f\s+([0-9]|\s|\/|\-)+/mg;

        private static fetch(url: string, onload: (content: string) => void) {
            let request = new XMLHttpRequest();
            request.onreadystatechange = () => {
                if (request.readyState == 4 && request.status == 200) {
                    if (onload) {
                        onload(request.responseText);
                    }
                }
            };
            request.open('GET', url);
            request.send();
        }

        private static praiseAttibuteLines(lines) {
            let result: Array<Array<number>> = [];
            if (lines == null) {
                return;
            }
            lines.forEach((expression: string) => {
                let data: Array<number> = [];
                expression.match(OBJLoader.numberPattern).forEach(
                    (expression) => {
                        if (expression != "") {
                            data.push(parseFloat(expression));
                        }
                    }
                );
                result.push(data);
            });
            return result;
        }

        private static fillAVertex(target: Array<number>, data: Array<number>) {
            for (let i = 0; i < data.length; ++i) {
                target.push(data[i]);
            }
        }

        private static parseAsTriangle(faces: Array<string>, forEachFace: (face: Array<string>) => void) {
            for (let i = 0; i < faces.length - 2; ++i) {
                let triangleFace = [faces[0], faces[i + 1], faces[i + 2]];
                forEachFace(triangleFace);
            }
        }

        private static buildUpMeshes(content: string, unIndexedPositions: Array<Array<number>>,
            unIndexedUVs: Array<Array<number>>, unIndexedNormals: Array<Array<number>>)
            : Object3d {
            let container: Object3d = new Object3d();
            let objects = content.split(OBJLoader.objectSplitPattern);
            objects.splice(0, 1);
            objects.forEach((objectContent) => {
                let geometry: Geometry = new Geometry();
                let faces = objectContent.match(OBJLoader.indexPattern);
                faces == null ? null : faces.forEach((faceStr) => {
                    OBJLoader.parseAsTriangle(faceStr.match(OBJLoader.faceSplitVertPattern), (triangleFaces) => {
                        triangleFaces.forEach((perVertData) => {
                            let match = perVertData.match(OBJLoader.facePerVertPattern);
                            if (match != null && match[1] != null) {
                                let positionIndex = parseInt(match[1]) - 1;
                                geometry.faces.data.push(geometry.attributes.position.data.length / 3);
                                geometry.addVertex({
                                    position: unIndexedPositions[positionIndex],
                                    uv: [unIndexedUVs[parseInt(match[2]) - 1][0], unIndexedUVs[parseInt(match[2]) - 1][1]],
                                    normal: unIndexedNormals[parseInt(match[3]) - 1]
                                })
                            }
                        })
                    })
                });
                let mesh = new Mesh(geometry, [new Material()]);
                container.addChild(mesh);
            });
            return container;
        }

        public static load(url: string, onload: (meshes: Object3d) => void) {
            OBJLoader.fetch(url, (content: string) => {
                // remove comment
                content = content.replace(OBJLoader.commentPattern, '');
                let positionlines: Array<string> = content.match(OBJLoader.vertexPattern)
                let uvlines: Array<string> = content.match(OBJLoader.uvPattern);
                let normallines: Array<string> = content.match(OBJLoader.normalPattern);
                let unIndexedPositions = OBJLoader.praiseAttibuteLines(positionlines);
                let unIndexedUVs = OBJLoader.praiseAttibuteLines(uvlines);
                let unIndexedNormals = OBJLoader.praiseAttibuteLines(normallines);
                let container = OBJLoader.buildUpMeshes(content, unIndexedPositions, unIndexedUVs, unIndexedNormals);
                onload(container);
            });
        }
    }
}
