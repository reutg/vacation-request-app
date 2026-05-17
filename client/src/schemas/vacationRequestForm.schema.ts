import * as yup from 'yup'

export const vacationRequestResolver = yup.object({
  startDate: yup.date().nullable().required('Start date is required'),
  endDate: yup
    .date()
    .nullable()
    .required('End date is required')
    .min(yup.ref('startDate'), 'End date must be after start date'),
  reason: yup.string().trim(),
})
