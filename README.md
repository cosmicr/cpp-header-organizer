# C++ Header Organiser

VS Code extension to organise headers in your CPP file.

I made this for my own use, but others may like to use it or modify for their own needs.

## Features

This VS Code extension will organise headers using the following rules:

1. Headers should be included in the following order:

   - Standard library headers (e.g., `<memory>`, `<iostream>`, etc.)
   - Third-party library headers (e.g., `<SFML/Graphics.hpp>`)
   - Application headers (e.g., `"core/Game.h"`)
   - The header file corresponding to the current .cpp file should be included last.

2. Headers should be in alphabetical order within each group.

**Example input:**

```cpp
#include "Game.h"
#include <SFML/Graphics.hpp>
#include <iostream>
#include <fstream>
#include <queue>
#include <memory>
#include <imgui-SFML.h>
#include <imgui.h>
#include "TileMap.h"
#include "ResourceManager.h"
#include <nlohmann/json.hpp>
#include <filesystem>
```

**Example output:**

```cpp
// Standard library headers
#include <fstream>
#include <iostream>
#include <memory>
#include <queue>

// Third-party library headers
#include <SFML/Graphics.hpp>
#include <imgui-SFML.h>
#include <imgui.h>
#include <nlohmann/json.hpp>

// Application headers
#include "Game.h"
#include "ResourceManager.h"
#include "TileMap.h"
```

## Requirements

No specific requirements, other than a recent version of VSCode. I made the extension with VSCode 1.77

## Extension Settings

No specific settings are set when using this extension.

## Known Issues

- Running the extension more than once will re-create comments for headers

## Release Notes

Refer to [CHANGELOG.md](CHANGELOG.md) for release info.

### 1.0.0

Initial release.
