import { defineConfig, presetTypography, presetWind4 } from 'unocss';

export default defineConfig({
  presets: [presetTypography(), presetWind4],
  shortcuts: {
    'flex-in-row': 'flex flex-row justify-start items-center',
    'flex-in-end': 'flex flex-row justify-end items-center',
    'flex-line-center': 'flex flex-row justify-center items-center',
    'flex-in-sb': 'flex flex-row justify-between items-center',
    'flex-in-col': 'flex flex-col justify-start',
    'flex-in-box': 'flex flex-col justify-center items-center',
    'shadow-around': 'shadow-[0_2px_16px_#1055bd1a]',
  },
});
