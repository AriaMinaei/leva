import React, { useState } from 'react'
import { RgbaColorPicker, RgbaColor, RgbColorPicker } from 'react-colorful'
import tinycolor from 'tinycolor2'
import { Overlay } from '../Misc'
import { Color as ColorType, InternalColorSettings } from './color-plugin'
import { LevaInputProps } from '../../types'
import { PickerWrapper, ColorPreview, PickerContainer } from './StyledColor'
import { ValueInput } from '../ValueInput'
import { Row, Label } from '../styles'

type ColorProps = LevaInputProps<ColorType, InternalColorSettings>

export function Color({ value, displayValue, label, onChange, onUpdate, settings }: ColorProps) {
  const [showPicker, setShowPicker] = useState(false)
  const { format, hasAlpha } = settings
  const rgb = format !== 'rgb' ? tinycolor(value).toRgb() : (value as RgbaColor)
  const ColorPicker = hasAlpha ? RgbaColorPicker : RgbColorPicker
  return (
    <Row input>
      <Label>{label}</Label>
      <PickerContainer>
        <ColorPreview onClick={() => setShowPicker(true)} style={{ background: displayValue }} />
        <ValueInput value={displayValue} onChange={onChange} onUpdate={onUpdate} />
        {showPicker && (
          <PickerWrapper>
            <Overlay onClick={() => setShowPicker(false)} />
            <ColorPicker color={rgb} onChange={onUpdate} />
          </PickerWrapper>
        )}
      </PickerContainer>
    </Row>
  )
}
