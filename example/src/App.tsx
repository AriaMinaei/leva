import React from 'react'
import { useControls, folder, button, monitor, Leva } from 'leva'
import { Noise } from 'noisejs'
import Scene3D from './Scene3D'

const noise = new Noise(Math.random())

function Comp1() {
  const ref = React.useRef(4)
  React.useEffect(() => {
    let x = 0
    setInterval(() => {
      x += 0.1
      const t = Date.now()
      ref.current = 2 * noise.simplex2(3 * x + t, x) + (3 * Math.sin(x)) / x
    }, 30)
  }, [])

  const t = useControls({
    first: { value: 40, min: 30, max: 90 },
    image: { image: undefined },
    select: { options: ['x', 'y', ['x', 'y']] },
    interval: { min: -100, max: 100, value: [-10, 10] },
    color: '#ffffffff',
    refMonitor: monitor(ref, { graph: true, interval: 30 }),
    number: { value: 1000, min: 3 },
    folder2: folder({
      boolean: false,
      spring: { tension: 100, friction: 30 },
      folder3: folder(
        {
          'Hello Button': button(() => console.log('hello')),
          folder4: folder({
            pos2d: { x: 3, y: 4 },
            pos2dArr: [100, 200],
            pos3d: { x: 0.3, y: 0.1, z: 0.5 },
            pos3dArr: [Math.PI / 2, 20, 4],
          }),
        },
        { collapsed: false }
      ),
    }),
    colorObj: { r: 1, g: 2, b: 3 },
  })

  return (
    <div>
      <h1>Comp1</h1>
      <img src={t.image} width="200" />
      <pre>{JSON.stringify(t, null, 2)}</pre>
    </div>
  )
}

function Comp2() {
  const t = useControls('folder2.folder3', {
    number: 4,
    string: 'some string',
    'Button 2': button(() => console.log('hello2')),
  })
  return (
    <div>
      <h1>Comp2</h1>
      <pre>{JSON.stringify(t, null, 2)}</pre>
    </div>
  )
}

function Comp3() {
  const t = useControls({ file: { file: undefined } })

  return (
    <div>
      <h1>Comp3</h1>
      <pre>{JSON.stringify(t, null, 2)}</pre>
      <img src={t.file} />
    </div>
  )
}

export default function App() {
  const [c1, setC1] = React.useState(true)
  const [c2, setC2] = React.useState(false)
  const { checkbox } = useControls({ checkbox: true })
  return (
    <>
      <Leva />
      <div style={{ display: 'flex' }}>
        <div style={{ width: '50%' }}>{c2 && <Scene3D />}</div>
        <div>
          {c1 && <Comp1 />}
          {c2 && <Comp1 />}
          <Comp2 />
          <button onClick={() => setC1(t => !t)}>{c1 ? 'Hide' : 'Show'} Json</button>
          <button onClick={() => setC2(t => !t)}>{c2 ? 'Hide' : 'Show'} Scene</button>
        </div>
      </div>
    </>
  )
}
