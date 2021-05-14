import React, { useState } from 'react'

import './select.scss'

export interface SelectGroupProps {
  SelectArr: [
    {
      label: string
      value: string
    },
  ]
  value?: string
  setValue: (string) => void
  label?: string
  id: string
  layout: 'inline' | 'stacked'
}

export const SelectGroup = ({
  setValue,
  SelectArr,
  label,
  id,
  layout,
}: SelectGroupProps) => {
  return (
    <span
      className={
        layout === 'stacked' ? 'on-select-wrapper stacked' : 'on-select-wrapper'
      }>
      {label && <label htmlFor={id}>{label}</label>}
      <select
        className="on-select"
        onChange={e => setValue(e.target.value)}
        id={id}>
        {SelectArr.map((item, index) => (
          <option key={index} label={item.label} value={item.value} />
        ))}
      </select>
    </span>
  )
}
