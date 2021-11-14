const color = {
  desc: 'color',
  children: [
    {
      desc: 'R',
      props: {
        value: 0,
        range: { min: 0, max: 255 },
        step: 1,
      },
    },
    {
      desc: 'G',
      props: {
        value: 0,
        range: { min: 0, max: 255 },
        step: 1,
      },
    },
    {
      desc: 'B',
      props: {
        value: 0,
        range: { min: 0, max: 255 },
        step: 1,
      },
    },
  ],
}
export const editorSchema = {
  desc: 'editor',
  children: [
    {
      desc: 'shaping',
      children: [
        {
          desc: 'rotate',
          props: {
            value: 0,
            range: { min: -180, max: 180 },
            step: 1,
          },
        },
        {
          desc: 'scale',
          props: {
            value: 1,
            range: { min: 0.1, max: 2 },
            step: 0.1,
          },
        },
        {
          desc: 'layer',
          props: {
            value: 0.1,
            range: { min: 0.1, max: 0.7 },
            marks: {
              0.7: 7,
              0.6: 6,
              0.5: 5,
              0.4: 4,
              0.3: 3,
              0.2: 2,
              0.1: 1,
            },
            step: null,
          },
        },
      ],
    },
    {
      desc: 'filters',
      children: [
        {
          desc: 'brightness',
          props: {
            value: 0.0,
            range: { min: -0.5, max: 0.5 },
            step: 0.01,
          },
        },
        {
          desc: 'contrast',
          props: {
            value: 0.0,
            range: { min: -0.3, max: 0.3 },
            step: 0.01,
          },
        },
        {
          desc: 'hue',
          props: {
            value: 0.0,
            range: { min: -1, max: 1 },
            step: 0.005,
          },
        },
        {
          desc: 'saturation',
          props: {
            value: 0.0,
            range: { min: -0.5, max: 0.5 },
            step: 0.005,
          },
        },
        {
          desc: 'vignette',
          props: {
            value: 0.0,
            range: { min: 0, max: 10 },
            step: 0.005,
          },
        },
      ],
    },
    color,
  ],
}
export const shaderSchema = {
  desc: 'shader',
  children: [
    {
      desc: 'cell',
      children: [
        {
          desc: 'rows',
          props: {
            range: { min: 2, max: 64 },
            step: 1,
          },
        },
...color.children
      ],
    },
    {
      desc: 'pure',
      children: [
				...color.children],
    },
  ],
}
