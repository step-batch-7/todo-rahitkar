#!/bin/bash

cat <<EOF > .git/hooks/pre-commit  
 npm test  
if [ \$? != 0 ]; then 
echo "fix the error";
    exit 1
fi
EOF

chmod +x .git/hooks/pre-commit  
