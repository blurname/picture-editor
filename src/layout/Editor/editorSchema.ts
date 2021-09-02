export const editorSchema = {
  desc: 'editor',
  children: [
    {
      desc: 'rangeInput',
      props: { min: 0, max: 10.0 },
      children: [
        {
          desc: 'sasturation',
          props: {
            value: 1.0,
          },
        },
        {
          desc: 'alpha',
          props: {
            value: 2.0,
          },
        },
        {
          desc: 'alpha',
          props: {
            value: 3.0,
          },
        },
        {
          desc: 'height',
          props: {
            value: 3.0,
          },
        },
        {
          desc: 'width',
          props: {
            value: 3.0,
          },
        },
      ],
    },
  ],
}
