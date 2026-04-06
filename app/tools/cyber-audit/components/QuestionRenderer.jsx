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
      <label className="block text-sm font-medium text-zinc-200">
        <span className="text-zinc-600 mr-2">{index + 1}.</span>
        {question.text}
        {question.tooltip && <Tooltip tooltip={question.tooltip} />}
      </label>

      {question.nistFunction && (
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
            NIST {question.nistFunction}
          </span>
          {question.cisControl && (
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-400 border border-zinc-700">
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
