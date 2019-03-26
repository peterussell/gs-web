export class GSUtils {

    // thanks https://stackoverflow.com/questions/20080393/sorting-numbers-with-multiple-decimal-points
    static sortMultiPartNumbers = function(a: string, b: string) {
        let nums1 = a.split(".");
        let nums2 = b.split(".");

        for (var i = 0; i < nums1.length; i++) {
            if (+nums2[i]) { // assuming 5..2 is invalid
                if (nums1[i] !== nums2[i]) {
                return +nums1[i] - +nums2[i];   
                } // else continue
            } else {
                return 1; // no second number in b
            }
        }
        return -1; // was missing case b.len > a.len
    }
}