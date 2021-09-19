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
				//{
          //desc: 'translateX',
          //props: {
            //value: 0.0,
            //range: { min: -1, max: 1 },
            //step: 0.01,
          //},
        //},
        //{
          //desc: 'translateY',
          //props: {
            //value: 0.0,
            //range: { min: -1, max: 1 },
            //step: 0.01,
          //},
        //},
        //{
          //desc: 'scaleX',
          //props: {
            //value: 0.0,
            //range: { min: -1, max: 1 },
            //step: 0.01,
          //},
        //},
        //{
          //desc: 'scaleY',
          //props: {
            //value: 0.0,
            //range: { min: -1, max: 1 },
            //step: 0.01,
          //},
        //},
        {
          desc: 'layout',
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
          desc: 'Brightness',
          props: {
            value: 0.0,
            range: { min: -0.5, max: 0.5 },
            step: 0.01,
          },
        },
        {
          desc: 'Contrast',
          props: {
            value: 0.0,
            range: { min: -0.3, max: 0.3 },
            step: 0.01,
          },
        },
        {
          desc: 'Hue',
          props: {
            value: 0.0,
            range: { min: -1, max: 1 },
            step: 0.005,
          },
        },
        {
          desc: 'Saturation',
          props: {
            value: 0.0,
            range: { min: -0.5, max: 0.5 },
            step: 0.005,
          },
        },
        {
          desc: 'Vignette',
          props: {
            value: 0.0,
            range: { min: 0, max: 10 },
            step: 0.005,
          },
        },
      ],
    },
  ],
}
