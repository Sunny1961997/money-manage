import { jsPDF } from "jspdf"

import { PlusJakartaSansItalicVariableFontWght } from "./fonts/PlusJakartaSans-Italic-VariableFont_wght"
import { OutfitRegular } from "./fonts/Outfit-Regular"
import { OutfitBold } from "./fonts/Outfit-Bold"

export const PDF_FONT_PRIMARY = "Outfit"
export const PDF_FONT_ITALIC = "Outfit-Italic" // Alias we will use for the italic font
export const PDF_FALLBACK_SANS = "helvetica"
export const PDF_FALLBACK_SERIF = "times"

/**
 * Registers global fonts with a jsPDF instance.
 * @param doc The jsPDF instance to register fonts on.
 */
export function registerGlobalFonts(doc: jsPDF) {
    // 1. Primary Font (Outfit) - Static Files for Compatibility
    doc.addFileToVFS("Outfit-Regular.ttf", OutfitRegular)
    doc.addFont("Outfit-Regular.ttf", PDF_FONT_PRIMARY, "normal")

    doc.addFileToVFS("Outfit-Bold.ttf", OutfitBold)
    doc.addFont("Outfit-Bold.ttf", PDF_FONT_PRIMARY, "bold")

    // 2. Italic Fallback (Plus Jakarta Sans)
    // Map "Plus Jakarta Sans Italic" to "Outfit" italic styles because "Outfit" does not have a static italic font file.
    doc.addFileToVFS("PlusJakartaSans-Italic.ttf", PlusJakartaSansItalicVariableFontWght)
    
    // Map to standard "italic" style of the primary font
    doc.addFont("PlusJakartaSans-Italic.ttf", PDF_FONT_PRIMARY, "italic")
    doc.addFont("PlusJakartaSans-Italic.ttf", PDF_FONT_PRIMARY, "bolditalic")
    
    // Also map to the explicit italic constant for safety
    doc.addFont("PlusJakartaSans-Italic.ttf", PDF_FONT_ITALIC, "normal")
    doc.addFont("PlusJakartaSans-Italic.ttf", PDF_FONT_ITALIC, "italic")

    doc.setFont(PDF_FONT_PRIMARY)
}



