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
      ],
    },
  ],
}
