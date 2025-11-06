#!/bin/bash

OUTPUT_ZIP="output.zip"
[ -f "$OUTPUT_ZIP" ] && rm "$OUTPUT_ZIP"

# 用陣列暫存要壓縮的檔案列表
files_to_zip=()

while IFS= read -r line || [[ -n "$line" ]]; do
  # 展開通配符（glob expansion）
  matches=( $line )
  for match in "${matches[@]}"; do
    if [ -e "$match" ]; then
      files_to_zip+=("$match")
    else
      echo "警告：找不到 '$match'"
    fi
  done
done < file_list.txt

# 呼叫 zip
zip -r "$OUTPUT_ZIP" "${files_to_zip[@]}"