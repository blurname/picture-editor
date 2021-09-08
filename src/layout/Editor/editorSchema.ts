export const editorSchema = {
  desc: 'editor',
  children: [
    {
      desc: 'rangeInput',
      children: [
        {
          desc: 'translate',
          props: {
            value: 1.0,
            range: { min: 0, max: 1.0 },
          },
        },
        {
          desc: 'scale',
          props: {
            value: 2.0,
            range: { min: 0, max: 1.0 },
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
