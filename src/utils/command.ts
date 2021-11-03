export const quadClearCommand = {
  name: 'quadClear',
  onBefore(gl: WebGLRenderingContext, rect: Rect) {
    // console.log(rect)
    gl.enable(gl.SCISSOR_TEST)
    gl.scissor(rect.x, rect.y, rect.width, rect.height)
    gl.clearColor(0, 0, 0, 0)
    gl.clearDepth(1)
    // gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
    // gl.enable(gl.DEPTH_TEST)
    gl.disable(gl.SCISSOR_TEST)
  },
  onAfter() {},
}
export const depthCommand = {
  name: 'depth',
  onBefore(gl: WebGLRenderingContext) {
    gl.enable(gl.DEPTH_TEST)
  },
  onAfter() {},
}
const beforeWithColor = (gl, resource) => {
  const { state, colorTexture, fbo, rbo } = resource
  let { size } = state
  gl.viewport(0, 0, size, size)
  gl.bindFramebuffer(gl.FRAMEBUFFER, fbo)
  gl.bindRenderbuffer(gl.RENDERBUFFER, rbo)
  gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, size, size)
  gl.framebufferTexture2D(
    gl.FRAMEBUFFER,
    gl.COLOR_ATTACHMENT0,
    gl.TEXTURE_2D,
    colorTexture,
    0,
  )
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
}

const beforeWithDepth = (gl: WebGLRenderingContext, resource) => {
  const { state, fbo } = resource
  const { size } = state
	gl.viewport(0, 0, size, size)
  gl.bindFramebuffer(gl.FRAMEBUFFER, fbo)
	gl.clear(gl.DEPTH_BUFFER_BIT)
}

export const Offscreen2DCommand = {
  name: 'offscreen2D',
  onBefore(gl: WebGLRenderingContext, resource:any) {
    const { depth } = resource.state
    depth ? beforeWithDepth(gl, resource) : beforeWithColor(gl, resource)
  },
  onAfter(gl: WebGLRenderingContext) {
    gl.bindFramebuffer(gl.FRAMEBUFFER, null)
		gl.viewport(0,0,gl.canvas.width,gl.canvas.height)
  },
}
