"use client"

import YesNoToggle from "./YesNoToggle"
import MultipleChoice from "./MultipleChoice"
import MultiSelect from "./MultiSelect"
import FrequencySelect from "./FrequencySelect"
import MaturityTier from "./MaturityTier"
import ShortText from "./ShortText"
import Tooltip from "./Tooltip"

export default function QuestionRenderer({ question, value, onChange, index }) {
  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-[#0F172A]">
        <span className="text-[#94A3B8] mr-2">{index + 1}.</span>
        {question.text}
        {question.tooltip && <Tooltip tooltip={question.tooltip} />}
      </label>

      {question.nistFunction && (
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#EFF6FF] text-[#1D4ED8] border border-[#EFF6FF]">
            NIST CSF 2.0 {question.nistFunction}
          </span>
          {question.cisControl && (
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#F0FDFA] text-[#0F766E] border border-[#F0FDFA]">
              CIS {question.cisControl}
            </span>
          )}
        </div>
      )}

      {question.type === "yesno" && (
        <YesNoToggle value={value} onChange={onChange} />
      )}

      {question.type === "singleselect" && (
        <MultipleChoice
          options={question.options}
          value={value}
          onChange={onChange}
        />
      )}

      {question.type === "choice" && (
        <MultipleChoice
          options={question.options}
          value={value}
          onChange={onChange}
        />
      )}

      {question.type === "multiselect" && (
        <MultiSelect
          options={question.options}
          value={value}
          onChange={onChange}
        />
      )}

      {question.type === "frequency" && (
        <FrequencySelect
          options={question.options}
          value={value}
          onChange={onChange}
        />
      )}

      {question.type === "maturity" && (
        <MaturityTier value={value} onChange={onChange} />
      )}

      {question.type === "text" && (
        <ShortText value={value} onChange={onChange} />
      )}
    </div>
  )
}
