// src/headerOrganizer.ts

const standardHeadersList: string[] = [
    "concepts", "coroutine", "any", "bitset", "chrono", "compare", "csetjmp", "csignal", "cstdarg",
    "cstddef", "cstdlib", "ctime", "expected", "functional", "initializer_list", "optional",
    "source_location", "tuple", "type_traits", "typeindex", "typeinfo", "utility", "variant",
    "version", "memory", "memory_resource", "new", "scoped_allocator", "cfloat", "cinttypes",
    "climits", "cstdint", "limits", "stdfloat", "cassert", "cerrno", "exception", "stacktrace",
    "stdexcept", "system_error", "cctype", "charconv", "cstring", "cuchar", "cwchar", "cwctype",
    "format", "string", "string_view", "array", "deque", "flat_map", "flat_set", "forward_list",
    "list", "map", "mdspan", "queue", "set", "span", "stack", "unordered_map", "unordered_set",
    "vector", "iterator", "generator", "ranges", "algorithm", "execution", "bit", "cfenv",
    "cmath", "complex", "numbers", "numeric", "random", "ratio", "valarray", "clocale", "codecvt",
    "locale", "cstdio", "fstream", "iomanip", "ios", "iosfwd", "iostream", "istream", "ostream",
    "print", "spanstream", "sstream", "streambuf", "strstream", "syncstream", "filesystem",
    "regex", "atomic", "barrier", "condition_variable", "future", "latch", "mutex", "semaphore",
    "shared_mutex", "stop_token", "thread", "assert.h", "ctype.h", "errno.h", "fenv.h", "float.h",
    "inttypes.h", "limits.h", "locale.h", "math.h", "setjmp.h", "signal.h", "stdarg.h", "stddef.h",
    "stdint.h", "stdio.h", "stdlib.h", "string.h", "time.h", "uchar.h", "wchar.h", "wctype.h",
    "stdatomic.h", "ccomplex", "complex.h", "ctgmath", "tgmath.h", "ciso646", "cstdalign", "cstdbool",
    "iso646.h", "stdalign.h", "stdbool.h"
];

function extractAndRemoveHeaders(content: string): { contentWithoutHeaders: string; headerLines: string[]; firstHeaderIndex: number } {
    const headerLines: string[] = [];
    const contentLines = content.split('\n');
    let firstHeaderIndex = -1;
    const contentWithoutHeaders = contentLines
        .filter((line, index) => {
            if (line.trim().startsWith('#include')) {
                if (firstHeaderIndex === -1) {
                    firstHeaderIndex = index;
                }
                headerLines.push(line);
                return false;
            }
            return true;
        })
        .join('\n');
    return { contentWithoutHeaders, headerLines, firstHeaderIndex };
}

export function organizeHeaders(content: string, currentFile: string): string {
    const headerRegex = /^#include\s*([<"])(.+)([>"])\r$/;
    let standardHeaders: string[] = [];
    let thirdPartyHeaders: string[] = [];
    let applicationHeaders: string[] = [];

    const { contentWithoutHeaders, headerLines, firstHeaderIndex } = extractAndRemoveHeaders(content);

    const fileNameNoExt = currentFile.split(".")[0];
    let fileHeaderStatement;

    headerLines.forEach((line) => {
        const match = line.match(headerRegex);
        if (match) {
            const includeStatement = match[0];
            const header = match[2];
            const delimiter = match[1];

            if (delimiter === '<') {
                if (standardHeadersList.includes(header)) {
                    standardHeaders.push(includeStatement);
                } else {
                    thirdPartyHeaders.push(includeStatement);
                }
            } else {
                if (header.split(".")[0] === fileNameNoExt) {
                    fileHeaderStatement = includeStatement;
                }
                else {
                    applicationHeaders.push(includeStatement);
                }
            }
        }
    });

    standardHeaders = standardHeaders.sort();
    thirdPartyHeaders = thirdPartyHeaders.sort();
    applicationHeaders = applicationHeaders.sort();
    if (fileHeaderStatement) {
        applicationHeaders.push(fileHeaderStatement); // current file class goes last
    }

    const organizedHeaders =
        '// Standard library headers\n' +
        standardHeaders.join('\n') +
        '\n\n// Third-party library headers\n' +
        thirdPartyHeaders.join('\n') +
        '\n\n// Application headers\n' +
        applicationHeaders.join('\n') +
        '\n';

    const updatedContentLines = [
        ...content.split('\n').slice(0, firstHeaderIndex),
        organizedHeaders,
        ...contentWithoutHeaders.split('\n').slice(firstHeaderIndex),
    ];

    const updatedContent = updatedContentLines.join('\n');

    return updatedContent;
}
