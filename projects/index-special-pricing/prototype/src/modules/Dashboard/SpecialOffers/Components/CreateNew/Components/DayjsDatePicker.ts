import generatePicker from 'antd/es/date-picker/generatePicker'
import dayjsGenerateConfig from 'rc-picker/es/generate/dayjs'
import type { Dayjs } from '@utils/dayjs'

// antd v4's own DatePicker is `generatePicker(momentGenerateConfig)` (moment-based). This whole flow
// uses dayjs, so opening the moment picker crashes with `clone.localeData is not a function`. Rebuild
// it on the dayjs generate config instead (needs localeData/weekOfYear/weekYear plugins — see utils/dayjs.ts).
export const DatePicker = generatePicker<Dayjs>(dayjsGenerateConfig)
