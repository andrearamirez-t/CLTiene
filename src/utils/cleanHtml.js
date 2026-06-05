export const cleanHtml = (html) =>
    html
        .replace(/background-color\s*:\s*rgb\(15,\s*23,\s*42\)[^;"']*/g, 'background-color: #f8fafc')
        .replace(/color\s*:\s*rgb\(203,\s*213,\s*225\)[^;"']*/g, 'color: #334155')
        .replace(/border-bottom\s*:\s*1px solid rgb\(30,\s*41,\s*59\)[^;"']*/g, 'border-bottom: 1px solid #e2e8f0');
