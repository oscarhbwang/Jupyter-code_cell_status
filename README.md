# Introduction

According to the code cell status "output_area.prompt_overlay" is colored.  
Light Cyan, Linen and Pink represent "running", "finished successfully" and "finished with errors" respectively.

# Setup

## 1. Installation

1. make the `nbextensions` folder to `~/.ipython/`
2. copy the `code_cell_status` folder to `~/.ipython/nbextensions/`

## 2. Configuration

1. make (or edit) youre `~/.jupyter/nbconfig/notebook.json` file

```
{
  "load_extensions": {
    "code_cell_status/main": true
  }
}
```

1. Edit the .jupyter/jupyter_notebook.json to look like this

  ```
  {
    "Exporter": {
      "preprocessors": [
        "pre_codefolding.CodeFoldingPreprocessor",
        "pre_pymarkdown.PyMarkdownPreprocessor"
      ]
    },
    "NbConvertApp": {
      "postprocessor_class": "post_embedhtml.EmbedPostProcessor"
    },
    "NotebookApp": {
      "server_extensions": [
        "nbextensions"
      ]
    },
    "version": 1
  }
  ```

Edit the .jupyter/jupyter_nbconvert.json to look like this:

  ```
  {
    "Exporter": {
      "preprocessors": [
        "pre_codefolding.CodeFoldingPreprocessor",
        "pre_pymarkdown.PyMarkdownPreprocessor"
      ]
    },
    "NbConvertApp": {
      "postprocessor_class": "post_embedhtml.EmbedPostProcessor"
    },
    "version": 1
  }
  ```
# Usage

1. 通常と同じ手順でnotebookを使用してください。セルを実行すると実行状態が色によって可視化されます。

# License

This project is licensed under the terms of the Modified BSD License (also known as New or Revised or 3-Clause BSD), see LICENSE.txt.
