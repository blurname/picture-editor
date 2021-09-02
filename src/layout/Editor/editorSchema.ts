export const editorSchema = {
  desc: 'editor',
  children: [
    {
      desc: 'rangeInput',
      children: [
        {
          desc: 'sasturation',
          props: {
            value: 1.0,
            range: { min: 0, max: 1.0 },
          },
        },
        {
          desc: 'alpha',
          props: {
            value: 2.0,
            range: { min: 0, max: 1.0 },
          },
        },
        {
          desc: 'alpha',
          props: {
            value: 3.0,
            range: { min: 0, max: 1.0 },
          },
        },
        {
          desc: 'height',
          props: {
            value: 200,
            range: { min: 200, max: 400 },
          },
        },
        {
          desc: 'width',
          props: {
            value: 200,
            range: { min: 200, max: 400 },
          },
        },
      ],
    },
  ],
}
