/// <reference path="../CanvasToy.ts"/>


namespace CanvasToy {

    export abstract class Texture {
        public glTexture: WebGLTexture;
        public textureCoord: number[] = [];
        public unit: number;
        public dataCompleted: boolean = false;
        public isReadyToUpdate: boolean = false;
        constructor(
            public image?: HTMLImageElement,
            public type: number = gl.TEXTURE_2D,
            public format: number = gl.RGB,
            public wrapS: number = gl.CLAMP_TO_EDGE,
            public wrapT: number = gl.CLAMP_TO_EDGE,
            public magFilter: number = gl.NEAREST,
            public minFilter: number = gl.NEAREST) {
            this.glTexture = gl.createTexture();
        }
        public setUpTextureData() {
            if (this.dataCompleted) {
                return false;
            }
            this.dataCompleted = true;
            return true;
        };
    }
}
