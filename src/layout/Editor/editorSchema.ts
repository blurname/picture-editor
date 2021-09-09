export const editorSchema = {
  desc: 'editor',
  children: [
    {
      desc: 'rangeInput',
      children: [
        {
          desc: 'translateX',
          props: {
            value: 0.0,
            range: { min: -10, max: 10 },
          },
        },
        {
          desc: 'translateY',
          props: {
            value: 0.0,
            range: { min: -10, max: 10 },
          },
        },
        {
          desc: 'scaleX',
          props: {
            value: 2.0,
            range: { min: -100, max: 100 },
          },
        },
        {
          desc: 'scaleY',
          props: {
            value: 2.0,
            range: { min: -100, max: 100 },
          },
        },
        {
          desc: 'rotate',
          props: {
            value: 0.0,
            range: { min: -180, max: 180 },
          },
        },
        {
          desc: 'Brightness',
          props: {
            value: 0.0,
            range: { min: -0.5, max: 0.5 },
						step:0.01
          },
        },
        {
          desc: 'Contrast',
          props: {
            value: 0.0,
            range: { min: -0.3, max: 0.3 },
						step:0.01
          },
        },
        {
          desc: 'Hue',
          props: {
            value: 0.0,
            range: { min: -1, max: 1 },
						step:0.005
          },
        },
        {
          desc: 'Saturation',
          props: {
            value: 0.0,
            range: { min: -0.5, max: 0.5 },
						step:0.005
          },
        },
        {
          desc: 'Vignette',
          props: {
            value: 0.0,
            range: { min: 0, max: 10 },
						step:0.005
          },
        },
      ],
    },
  ],
}
