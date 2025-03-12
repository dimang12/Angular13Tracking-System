// generate object of width size parameters
export const sizeParams = {
  xSmall: 'px-1 py-0.5 text-xs',
  small: 'px-2 py-1 text-sm',
  medium: 'px-3 py-1.5 text-base',
  large: 'px-4 py-2 text-lg',
  xLarge: 'px-5 py-3 text-xl',
}

// generate array of task status parameters
export const statusParams = [
  { value: 1, label: 'Not Start', color: 'text-gray-600' },
  { value: 2, label: 'On Going', color: 'text-purple-600' },
  { value: 3, label: 'Completed', color: 'text-green-600' },
  { value: 4, label: 'On Hold', color: 'text-yellow-600' },
  { value: 5, label: 'Cancelled', color: 'text-red-600' },
]

// generate array of 10 percentage values
export const percentageParams = Array.from({ length: 11 }, (_, i) => {
  return { value: (i) * 10, label: `${(i) * 10}%` };
});
