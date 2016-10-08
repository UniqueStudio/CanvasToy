/// <reference path="../CanvasToy.ts"/>

namespace CanvasToy {

    export class Geometry {

        public attributes = {
            position: new Attribute({ type: DataType.float, size: 3, data: [] }),
            uv: new Attribute({ type: DataType.float, size: 2, data: [] }),
            normal: new Attribute({ type: DataType.float, size: 3, data: [] }),
            flatNormal: new Attribute({ type: DataType.float, size: 3, data: [] })
        }

        public faces = { data: [], buffer: gl.createBuffer() };

        constructor() {

        }

        public setAttribute(name, attribute: Attribute) {
            this.attributes[name] = attribute;
        }

        public addVertex(vertex: any) {
            for (let attributeName in this.attributes) {
                if (this.attributes[attributeName] != undefined) {
                    if (vertex[attributeName] == undefined) {
                        return;
                    }
                    if (vertex[attributeName].length != this.attributes[attributeName].size) {
                        console.error('length ' + attributeName + 'wrong');
                        return;
                    }
                    this.attributes[attributeName].data = this.attributes[attributeName].data.concat(vertex[attributeName]);
                }
            }
        }

        public removeAttribute(name: string) {
            this.attributes[name] = undefined;
        }

        public getVertexByIndex(index: number) {
            let vertex: any = {};
            for (let attributeName in this.attributes) {
                vertex[attributeName] = []
                for (let i = 0; i < this.attributes[attributeName].stride; ++i) {
                    vertex[attributeName].push(this.attributes[attributeName].data[this.attributes[attributeName].stride * index + i])
                }
            }
            return vertex;
        }


        public getTriangleByIndex(triangleIndex: number) {
            return [
                this.getVertexByIndex(triangleIndex * 3),
                this.getVertexByIndex(triangleIndex * 3 + 1),
                this.getVertexByIndex(triangleIndex * 3 + 2)
            ];
        }


        public generateFlatNormal() {
            for (let i = 0; i < this.faces.data.length; i += 3) {
                let triangle = this.getTriangleByIndex(i / 3);
                let flatX = (triangle[0].normals[0] + triangle[0].normals[1] + triangle[0].normals[2]) / 3;
                let flatY = (triangle[1].normals[0] + triangle[1].normals[1] + triangle[1].normals[2]) / 3;
                let flatZ = (triangle[2].normals[0] + triangle[0].normals[1] + triangle[2].normals[2]) / 3;

                var flat = [
                    flatX, flatY, flatZ,
                    flatX, flatY, flatZ,
                    flatX, flatY, flatZ
                ];
                this.attributes.flatNormal.data = this.attributes.flatNormal.data.concat(flat);
            }
        }
    }
}
